import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Configure Node.js polyfills for compatibility
  resolve: {
    alias: {
      // Add any necessary polyfills here if needed
    },
  },
  // Optimize build for Node.js 22
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
  },
  // Ensure development server works with Node.js 22
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
})
