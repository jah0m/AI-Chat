import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChatContainer from "./components/ChatContainer";

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex items-center justify-center">
        <ChatContainer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
