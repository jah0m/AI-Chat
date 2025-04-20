import React, { useState, useRef, useEffect } from "react";

const ChatInput = ({ onSendMessage, isLoading, onCancel }) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef(null);

  // 自动调整文本区域高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");

      // 重置高度
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 md:p-6">
      <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          className="w-full pl-4 pr-16 py-3 border-0 bg-gray-50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all duration-200 min-h-[52px] max-h-36"
          disabled={isLoading}
          rows={1}
        />

        <div className="absolute right-3 bottom-2.5">
          {isLoading ? (
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Cancel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!message.trim()}
              className={`p-1.5 rounded-full ${
                message.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-200 text-gray-400"
              } transition-colors`}
              title="发送"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          )}
        </div>
      </form>

      <div className="text-xs text-center text-gray-400 mt-3">@Jahom 2025</div>
    </div>
  );
};

export default ChatInput;
