import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  server: {
    proxy: {
      '/socket.io': {
        target: 'https://chat-app-server-swart.vercel.app', // Your backend URL
        ws: true, // Enable WebSocket proxying
        changeOrigin: true,
        secure: false
      }
    }
  }
})
