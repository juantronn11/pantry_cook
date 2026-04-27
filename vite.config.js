import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
      '/errors': 'http://localhost:3000'
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './documentation/tests/patrick_tests/setup.js',
css: { modules: { classNameStrategy: 'non-scoped' } },
    reporters: ['default', 'html'],
    outputFile: {
      html: './documentation/tests/patrick_tests/results/index.html',
    },
  },
})
