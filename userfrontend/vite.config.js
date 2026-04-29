import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // User frontend at root
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:10000'
    }
  }
})
