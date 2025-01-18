// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   // plugins: [react()],
//   plugins: import.meta.env.MODE === "development" ? [react()] : [],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_NODE_ENV': JSON.stringify('production')
  }
});