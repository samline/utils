import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://samline.github.io',
  base: '/utils',
  trailingSlash: 'always',
  build: { format: 'directory' },
})
