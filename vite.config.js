// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/react/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      './runtimeConfig': './runtimeConfig.browser'
    },
  },
  // This makes the dev server work with the /react/ base path
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: '/react/' // Opens at /react/ by default
  }
})