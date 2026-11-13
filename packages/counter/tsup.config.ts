import { fileURLToPath } from 'node:url'

import { defineConfig } from 'tsup'

// Private helpers and the is-visible observer pool are inlined into every
// build, so @samline/counter has no runtime dependencies.
const source = (path: string) => fileURLToPath(new URL(path, import.meta.url))
const paths = {
  '@samline/internal': '../internal/src/index.ts',
  '@samline/is-visible/core': '../is-visible/src/core/index.ts',
}
const alias = Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, source(path)]))

export default defineConfig([
  {
    entry: {
      index: 'src/index.ts',
      'vanilla/index': 'src/vanilla/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: {
      resolve: [/^@samline\/(internal|is-visible)/],
      compilerOptions: {
        baseUrl: '.',
        paths: Object.fromEntries(Object.entries(paths).map(([name, path]) => [name, [path]])),
      },
    },
    sourcemap: true,
    clean: true,
    target: 'es2020',
    treeshake: true,
    esbuildOptions: options => {
      options.alias = alias
    },
  },
  {
    entry: { 'browser/counter': 'src/browser/global.ts' },
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
