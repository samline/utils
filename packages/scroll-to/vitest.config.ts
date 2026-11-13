import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitest/config'

const source = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '@samline/internal': source('../internal/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.{ts,tsx}'],
    coverage: {
      include: ['src/**'],
      exclude: ['src/browser/**', 'src/**/*.css'],
      thresholds: { branches: 90, functions: 95, lines: 95, statements: 95 },
    },
  },
})
