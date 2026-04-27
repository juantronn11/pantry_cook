import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './documentation/tests/juan_tests/setup.js',
    include: ['./documentation/tests/juan_tests/**/*.test.{js,jsx}'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    reporters: ['default', 'html'],
    outputFile: {
      html: './documentation/tests/juan_tests/results/index.html',
    },
  },
})
