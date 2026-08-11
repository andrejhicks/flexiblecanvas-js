import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    open: true,
  },
  // Diagrams live outside src/ on purpose so you can edit them without
  // touching application code. Vite still hot-reloads them.
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1200,
  },
})
