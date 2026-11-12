import { defineConfig } from 'tsup'

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
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    treeshake: true,
    external,
    noExternal: [/^@samline\/internal/],
  },
  {
    entry: { 'browser/is-visible': 'src/browser/global.ts' },
    format: ['iife'],
    minify: true,
    sourcemap: true,
    clean: false,
    target: 'es2020',
    platform: 'browser',
    noExternal: [/^@samline\/internal/],
    outExtension: () => ({ js: '.global.js' }),
  },
])
