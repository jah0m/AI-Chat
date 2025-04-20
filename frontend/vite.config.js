// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 或者你的框架插件
import tailwindcss from '@tailwindcss/vite'; // 引入 Tailwind Vite 插件

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
      interval: 1000
    },
    hmr: {
      clientPort: 5173,
      protocol: 'ws',
      host: 'localhost'
    }
  }
});
