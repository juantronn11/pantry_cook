import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Christian's isolated test config — outputs results to this folder
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [path.resolve(__dirname, './setup.js')],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    reporters: ['default', 'html'],
    outputFile: {
      html: path.resolve(__dirname, './results/index.html'),
    },
    include: [path.resolve(__dirname, './**/*.test.{js,jsx}')],
    exclude: [path.resolve(__dirname, 'results/**'), 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../../src'),
    },
  },
})
