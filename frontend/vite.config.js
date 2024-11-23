import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: process.env.HOST ?? 'localhost',
    port: process.env.PORT ?? '5173'
  },
  define: {
    'import.meta.env.server_url': process.env.SERVER_URL ?? '"http://localhost:3000/"'
  }
})
