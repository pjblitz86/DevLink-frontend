import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const API_URL = isProduction
    ? 'https://devlink-deploy.onrender.com' // Production API
    : 'http://localhost:8080'; // Development API

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: !isProduction
        ? {
            '/api': {
              target: API_URL,
              changeOrigin: true,
              secure: false
            }
          }
        : undefined // No proxy in production
    },
    define: {
      'process.env.API_URL': JSON.stringify(API_URL)
    }
  };
});
