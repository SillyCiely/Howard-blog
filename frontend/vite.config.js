import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
    plugins: [react()],
    server: {
        host: process.env.HOST ?? 'localhost',
        port: process.env.PORT ?? '5173'
    },
    define: {
        'import.meta.env.VITE_SERVER_URL':
            JSON.stringify(process.env.SERVER_URL ?? 'http://localhost:3000'),
        'process.env': process.env
    }
})