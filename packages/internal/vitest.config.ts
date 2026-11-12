import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    coverage: {
      include: ['src/**'],
      thresholds: { branches: 90, functions: 95, lines: 95, statements: 95 },
    },
  },
})
