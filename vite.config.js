import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [/react/, /react-dom/], // Ensure React is included for proper bundling
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Explicitly add React and ReactDOM as external dependencies
    },
    chunkSizeWarningLimit: 1500 // Increase the limit (in KB)
  },
})
