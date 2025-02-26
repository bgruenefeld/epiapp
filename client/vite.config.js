import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/epiapp/",
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  staticCopy:{
    targets: [
      {
        src: 'public/data',  // Quelle (relativ zu `client/`)
        dest: ''  // Ziel: direkt nach `dist/`
      }
    ]
  }
});


