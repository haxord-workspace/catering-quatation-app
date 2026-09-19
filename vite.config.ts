import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets load cleanly on GitHub Pages under /catering-quatation-app/
  server: {
    port: 5173,
    host: true
  }
});
