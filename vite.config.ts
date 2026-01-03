import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/rea/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true, // Allow access from network (for phone testing on same network)
  },
});
