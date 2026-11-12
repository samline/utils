import { fileURLToPath } from 'node:url'

import { defineConfig } from 'tsup'

// Shared private helpers are inlined into every build: published packages
// never depend on @samline/internal.
const alias = {
  '@samline/internal': fileURLToPath(new URL('../internal/src/index.ts', import.meta.url)),
}

const external = ['react', 'vue', 'svelte', 'svelte/store']

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'vanilla/index': 'src/vanilla/index.ts',
      'react/index': 'src/react/index.ts',
      'vue/index': 'src/vue/index.ts',
      'svelte/index': 'src/svelte/index.ts',
    },
    format: ['esm', 'cjs'],
    // Inline @samline/internal's types too: it is never published.
    dts: {
      resolve: [/^@samline\/internal/],
      compilerOptions: {
        baseUrl: '.',
        paths: { '@samline/internal': ['../internal/src/index.ts'] },
      },
    },
    sourcemap: true,
    clean: true,
    target: 'es2020',
    treeshake: true,
    external,
    esbuildOptions: options => {
      options.alias = alias
    },
  },
  {
    entry: { 'browser/is-visible': 'src/browser/global.ts' },
    format: ['iife'],
    minify: true,
    sourcemap: true,
    clean: false,
    target: 'es2020',
    platform: 'browser',
    esbuildOptions: options => {
      options.alias = alias
    },
    outExtension: () => ({ js: '.global.js' }),
  },
])
