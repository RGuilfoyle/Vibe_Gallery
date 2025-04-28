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
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          amplify: ['aws-amplify', '@aws-amplify/ui-react'],
          gallery: ['react-photo-album']
        }
      }
    }
  },
  // Ensure development server works with Node.js 22
  server: {
    port: 3000,
    strictPort: false,
    open: true,
  },
})
