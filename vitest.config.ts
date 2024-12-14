import path from 'path';
import { defineConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./src/test/setupEnv.ts'],
    environment: 'node',
    onConsoleLog: (log: string, type: 'stdout' | 'stderr') => {
      if (type === 'stderr') return false;
      return true;
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', '.next/', 'src/app/**/*.test.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}) satisfies UserConfig;