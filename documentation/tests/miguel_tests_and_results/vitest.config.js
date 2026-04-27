// documentation/tests/miguel_tests_and_results/vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, 'setup.js')],
    include: [
      path.resolve(__dirname, '**/*.test.{js,jsx}'),
    ],
    reporters: ['verbose', 'html'],
    outputFile: {
      html: path.resolve(__dirname, 'results/index.html'),
    },
  },
});
