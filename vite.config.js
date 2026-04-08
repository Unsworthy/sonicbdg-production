import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/mpl-api': {
        target: 'https://id-mpl.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mpl-api/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Referer': 'https://id-mpl.com',
        },
      },
    },
  },
})