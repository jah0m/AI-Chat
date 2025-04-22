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
  
  // 取消流式响应
  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsStreaming(false);
    }
  }, []);
  
  // 使用 TanStack Query 处理聊天请求
  const chatMutation = useMutation({
    mutationFn: async (userMessage) => {
      // 如果已经在流式传输，先取消之前的请求
      if (isStreaming) {
        cancelStream();
      }
      
      // 创建新的 AbortController
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;
      
      // 添加用户消息
      const userMsg = { role: 'user', content: userMessage };
      const updatedMessages = [...messages, userMsg];
      
      setMessages(updatedMessages);
      saveChatHistory(updatedMessages);
      
      // 创建空的助手消息
      const assistantMsg = { role: 'assistant', content: '' };
      const withAssistantMsg = [...updatedMessages, assistantMsg];
      
      setMessages(withAssistantMsg);
      saveChatHistory(withAssistantMsg);
      
      // 开始流式处理
      setIsStreaming(true);
      
      try {
        // 准备API消息
        const messagesToSend = updatedMessages.map(({ role, content }) => ({ role, content }));
        
        // 处理流式响应
        await streamChatCompletion(
          messagesToSend, 
          (chunk) => {
            if (signal.aborted) {
              return; // 如果已中止，不再更新消息
            }
            
            setMessages(current => {
              const updated = [...current];
              const lastIndex = updated.length - 1;
              
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + chunk
              };
              
              saveChatHistory(updated);
              return updated;
            });
          },
          signal
        );
        
        return true;
      } catch (error) {
        // 处理中止错误
        if (error.name === 'AbortError') {
          console.log('请求已取消');
          
          // 处理取消后的消息状态 - 可以选择添加"[cancelled]"标记
          setMessages(current => {
            const updated = [...current];
            const lastIndex = updated.length - 1;
            
            if (updated[lastIndex].role === 'assistant') {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: updated[lastIndex].content + ' [cancelled]'
              };
              
              saveChatHistory(updated);
            }
            
            return updated;
          });
          
          return false;
        }
        
        // 重新抛出其他错误
        throw error;
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    }
  });
  
  // 发送消息
  const sendMessage = useCallback((message) => {
    if (!message.trim()) return;
    chatMutation.mutate(message);
  }, [chatMutation]);
  
  // 清除聊天
  const clearChat = useCallback(() => {
    // 取消任何正在进行的流
    if (isStreaming) {
      cancelStream();
    }
    setMessages([]);
    saveChatHistory([]);
  }, [isStreaming, cancelStream, saveChatHistory]);
  
  return {
    messages,
    isStreaming,
    isLoading: chatMutation.isPending,
    error: chatMutation.error,
    sendMessage,
    cancelStream,
    clearChat
  };
}