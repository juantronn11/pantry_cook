import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vitest config for Christian's test suite
// Outputs results to christian_tests_and_results/results
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './documentation/tests/christian_tests_and_results/setup.js',
    css: { modules: { classNameStrategy: 'non-scoped' } },
    reporters: ['default', 'html'],
    outputFile: {
      html: './documentation/tests/christian_tests_and_results/results/index.html',
    },
    include: ['./documentation/tests/christian_tests_and_results/**/*.test.{js,jsx}'],
  },
})
