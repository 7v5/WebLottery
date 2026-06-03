import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/uikit/',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});