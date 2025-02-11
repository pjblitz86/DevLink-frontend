import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: isProduction
            ? 'https://devlink-deploy.onrender.com' // Production API
            : 'http://localhost:8080', // Development API
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
