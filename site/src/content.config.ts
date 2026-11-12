import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { defineCollection } from 'astro:content'

const packagesDir = resolve(process.cwd(), '../packages')

/**
 * Each package's README is its documentation page: one source of truth.
 * The README's own `# @samline/<name>` heading is dropped because the page
 * renders its own <h1>.
 */
const readmes = defineCollection({
  loader: {
    name: 'package-readmes',
    load: async ({ store, renderMarkdown, watcher }) => {
      store.clear()
      for (const dir of await readdir(packagesDir)) {
        const file = resolve(packagesDir, dir, 'README.md')
        let source: string
        try {
          source = await readFile(file, 'utf8')
        } catch {
          continue
        }
        const body = source.replace(/^#\s+[^\n]*\n+/, '')
        store.set({ id: dir, data: {}, body, rendered: await renderMarkdown(body) })
        watcher?.add(file)
      }
    },
  },
})

export const collections = { readmes }
