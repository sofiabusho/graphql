import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true,
        proxy: {
            // Proxy API requests to avoid CORS issues
            '/api': {
                target: 'https://platform.zone01.gr',
                changeOrigin: true,
                secure: true,
                // Rewrite: remove /api prefix if needed, or keep it
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})

