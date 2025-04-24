import { defineConfig } from "vite";
import path from "path";
import vue from '@vitejs/plugin-vue';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL, // Use the API URL from the .env file
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
