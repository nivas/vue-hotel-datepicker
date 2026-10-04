import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Demo app build (npm run build:demo) -> ./docs, served by GitHub pages or uploaded anywhere
export default defineConfig({
  base: './', // relative paths: the build works from any folder, GitHub pages included
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'docs'
  }
})
