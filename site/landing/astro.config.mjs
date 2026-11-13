import { developmentRedirect } from '../shared/lib/development-routes.mjs'
import { defineConfig } from 'astro/config'
import tailwind from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import { inlineSmallStylesheets } from '../shared/lib/site-build.mjs'
import { project } from '../shared/lib/project.mjs'
import { collectionAlias } from '../shared/lib/collection.mjs'
const development = process.argv.includes('dev')
export default defineConfig({
  site: project.url,
  base: project.base === '/' ? '/' : project.base.slice(0, -1),
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  vite: {
    // Collection mode: `@collection/<package>/site/...` resolves into the monorepo.
    resolve: { alias: collectionAlias },
    plugins: [
      tailwind(),
      developmentRedirect({
        origin: `http://127.0.0.1:${project.dev.docsPort}`,
        include: project.docsBase,
      }),
    ],
    build: { assetsInlineLimit: inlineSmallStylesheets },
    define: { 'import.meta.env.BASE_URL': JSON.stringify(project.base) },
  },
})
