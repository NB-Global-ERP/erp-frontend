import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  define: {
    "process.env.VITE_API_BASE_URL": JSON.stringify("http://erp_service:8091/api/v1"),
  },
  optimizeDeps: {
    include: ['@svar-ui/react-grid', '@svar-ui/react-gantt'],
  },
})
