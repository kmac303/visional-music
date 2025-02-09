import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',        
    assetsDir: 'assets',  
    manifest: true,        
    rollupOptions: {
      input: './index.html',  
    }
  },
  optimizeDeps: {
    include: ['three']
  }
});