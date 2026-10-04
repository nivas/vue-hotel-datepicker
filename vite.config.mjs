import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

// Date parsing in the components depends on the local timezone; pin it so tests run the same everywhere.
process.env.TZ = 'Europe/Zagreb'

// Library build (npm run build:lib), dev server for the demo app (npm run dev) and unit tests (npm test).
// The demo/GitHub pages build lives in vite.demo.config.mjs.
export default defineConfig({
  plugins: [
    vue(),
    // same as `css: { extract: false }` in the Vue 2 build: consumers do not import a separate css file
    cssInjectedByJsPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'lib',
    copyPublicDir: false,
    sourcemap: true,
    lib: {
      entry: fileURLToPath(new URL('./src/index.js', import.meta.url)),
      name: 'VueHotelDatepicker',
      formats: ['es', 'umd'],
      fileName: format => format === 'es' ? 'vue-hotel-datepicker.mjs' : 'vue-hotel-datepicker.umd.js'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        exports: 'named',
        globals: { vue: 'Vue' }
      }
    }
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.js'],
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8',
      include: ['src/components/**', 'src/index.js']
    }
  }
})
