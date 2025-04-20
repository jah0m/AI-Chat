import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const MessageList = ({ messages }) => {
  const messagesEndRef = useRef(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Start your chat
        </h3>
        <p className="text-gray-500 max-w-sm">
          Ask me anything! I am here to help you with your questions and tasks.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
      {messages.map((message, index) => {
        const isUser = message.role === "user";
        return (
          <div
            key={index}
            className={`flex ${isUser ? "justify-end" : "justify-start"} group`}
          >
            {/* Avatar for assistant */}
            {!isUser && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mr-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 shadow-sm ${
                isUser
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-none"
                  : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
              }`}
            >
              {message.content ? (
                <div
                  className={`${
                    isUser ? "prose-invert" : "prose"
                  } prose-sm max-w-none`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            {...props}
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code
                            className={`${className} bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                message.role === "assistant" && (
                  <div className="flex items-center space-x-2 h-6">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                )
              )}
            </div>

            {/* Avatar for user */}
            {isUser && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 ml-3 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
