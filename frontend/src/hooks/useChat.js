// src/hooks/useChat.js
import { useState, useRef, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { streamChatCompletion } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef(null);
  
  // 加载聊天历史
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);
  
  // 保存聊天历史
  const saveChatHistory = useCallback((updatedMessages) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  }, []);
  
  // 使用 TanStack Query 处理聊天请求
  const chatMutation = useMutation({
    mutationFn: async (userMessage) => {
      // 添加用户消息
      const userMsg = { role: 'user', content: userMessage };
      const updatedMessages = [...messages, userMsg];
      setMessages(prev => {
        const updated = [...prev, userMsg];
        saveChatHistory(updated);
        return updated;
      });
      saveChatHistory(updatedMessages);
      
      // 创建空的助手消息
      const assistantMsg = { role: 'assistant', content: '' };
      // const withAssistantMsg = [...updatedMessages, assistantMsg];
      setMessages(prev => {
        const withAssistantMsg = [...prev, assistantMsg];
        saveChatHistory(withAssistantMsg);
        return withAssistantMsg;
      });
      
      // 开始流式处理
      setIsStreaming(true);
      
      try {
        // 准备API消息
        const messagesToSend = updatedMessages.map(({ role, content }) => ({ role, content }));
        
        // 处理流式响应 - 确保逐字显示
        await streamChatCompletion(messagesToSend, (chunk) => {
          setMessages(current => {
            const updated = [...current];
            const lastIndex = updated.length - 1;
            
            // 更新最后一条消息
            updated[lastIndex] = {
              ...updated[lastIndex],
              content: updated[lastIndex].content + chunk
            };
            
            saveChatHistory(updated);
            return updated;
          });
        });
        
        return true;
      } finally {
        setIsStreaming(false);
      }
    }
  });
  
  // 发送消息
  const sendMessage = useCallback((message) => {
    if (!message.trim() || isStreaming) return;
    chatMutation.mutate(message);
  }, [chatMutation, isStreaming]);
  
  // 取消响应
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);
  
  // 清除聊天
  const clearChat = useCallback(() => {
    setMessages([]);
    saveChatHistory([]);
  }, [saveChatHistory]);
  
  return {
    messages,
    isLoading: chatMutation.isPending || isStreaming,
    error: chatMutation.error,
    sendMessage,
    cancelStream,
    clearChat
  };
}
