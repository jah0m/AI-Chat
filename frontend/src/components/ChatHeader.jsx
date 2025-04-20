import React from "react";

const ChatHeader = ({ onClearChat }) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-gray-800">AI Chat</h1>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={onClearChat}
          className="flex items-center px-3 py-1.5 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          title="Clear history"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>Clear Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
