// documentation/tests/miguel_tests_and_results/setup.js
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  // only clear localStorage when it exists (jsdom environment)
  if (typeof localStorage !== 'undefined') {
    localStorage.clear();
  }
  vi.restoreAllMocks();
  vi.useRealTimers();
});
