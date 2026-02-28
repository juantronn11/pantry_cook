import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',        // simulate a browser DOM for React components
    globals: true,                // allow describe/it/expect without importing
    setupFiles: './src/test/setup.js',  // runs before every test file
    css: { modules: { classNameStrategy: 'non-scoped' } }, // CSS Modules work in tests
  },
})
