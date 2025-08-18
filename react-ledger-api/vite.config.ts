import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /docs to your API server
      '/api/json-api': {
        target: 'http://localhost:7575',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/json-api/, ''),
      },
    },
  },
})
