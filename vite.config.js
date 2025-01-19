import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',        // Ensure output goes to "dist"
    assetsDir: 'assets',   // Put images, CSS, and JS in "assets"
    manifest: true,        // Generate manifest.json for Netlify/Vercel
    rollupOptions: {
      input: './index.html',  // Ensure Vite builds from index.html
    }
  }
});