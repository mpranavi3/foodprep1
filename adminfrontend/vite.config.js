import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/admin/',  // Important: admin at /admin path
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:10000'
    }
  }
})
