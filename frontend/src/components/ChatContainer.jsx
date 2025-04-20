import React from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import { useChat } from "../hooks/useChat";

const ChatContainer = () => {
  const { messages, isLoading, error, sendMessage, cancelStream, clearChat } =
    useChat();

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden w-full">
      <ChatHeader onClearChat={clearChat} />

      <MessageList messages={messages} />

      {error && (
        <div className="p-3 mx-6 mb-4 bg-red-50 border border-red-100 text-red-800 text-sm rounded-lg">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error.message || "somehing went wrong"}
          </div>
        </div>
      )}

      <ChatInput
        onSendMessage={sendMessage}
        isLoading={isLoading}
        onCancel={cancelStream}
      />
    </div>
  );
};

export default ChatContainer;
