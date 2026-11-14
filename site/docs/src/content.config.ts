import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { glob } from 'astro/loaders'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import en from './i18n/translations/en'
import { project } from '../../shared/lib/project.mjs'
import { packagesDir, readCollection } from '../../shared/lib/collection.mjs'
import { withoutEmptyUnreleased, withoutTitle } from '../../shared/lib/changelog.mjs'

type Context = Parameters<ReturnType<typeof glob>['load']>[0]

/** Load a changelog file as one docs entry, refreshed while developing. */
const loadChangelog = async (
  context: Context,
  id: string,
  source: URL,
  order: number,
  /** Collection mode: the package name keeps each changelog's metadata unique. */
  packageName?: string
) => {
  const load = async () => {
    const body = withoutEmptyUnreleased(withoutTitle(await readFile(source, 'utf8')))
    const data = await context.parseData({
      id,
      data: {
        ...en.changelog,
        ...(packageName && {
          title: `${packageName} changelog`,
          description: `${packageName} release notes: every version, with breaking and behavior changes marked, newest first.`,
        }),
        locale: 'en',
        sidebar: { group: 'guides', order, label: 'Changelog' },
      },
    })
    context.store.set({
      id,
      data,
      body,
      digest: context.generateDigest(body + JSON.stringify(data)),
      rendered: await context.renderMarkdown(body, { fileURL: source }),
    })
  }
  await load()
  context.watcher?.add(fileURLToPath(source))
  context.watcher?.on('change', async path => {
    if (path === fileURLToPath(source)) await load()
  })
}

const packageDocs = {
  name: 'package-site-documentation',
  async load(context: Context) {
    await glob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/docs',
      generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
    }).load(context)
    await loadChangelog(context, 'changelog', new URL('../CHANGELOG.md', context.config.root), 7)
  },
}

// Collection mode (see .agents/collection-mode.md): each package's articles
// live in <packagesDir>/<package>/site/docs/ and are published under
// /docs/<package>/, followed by that package's CHANGELOG.md. /docs/ lists the
// packages.
const collectionDocs = {
  name: 'collection-site-documentation',
  async load(context: Context) {
    const packages = readCollection()
    // One glob for every package: a glob loader removes entries it did not
    // load itself, so one call per package would drop the earlier packages.
    await glob({
      pattern: `{${packages.map(item => item.slug).join(',')}}/site/docs/**/*.{md,mdx}`,
      base: packagesDir!,
      generateId: ({ entry }) =>
        entry
          .replace(/\.mdx?$/, '')
          .replace('/site/docs/', '/')
          .replace(/\/index$/, ''),
    }).load(context)
    for (const item of packages)
      await loadChangelog(
        context,
        `${item.slug}/changelog`,
        new URL(`file://${packagesDir}/${item.slug}/CHANGELOG.md`),
        99,
        item.name
      )
    const body = [
      `${project.description}`,
      '',
      ...packages.map(item => `- [${item.name}](${item.docsHome}) — ${item.summary}`),
    ].join('\n')
    const data = await context.parseData({
      id: 'index',
      data: {
        title: 'Documentation',
        description: `Guides, API references, options and release notes for every ${project.name} package, one section per package.`,
        locale: 'en',
        sidebar: { group: 'start', order: 1 },
      },
    })
    context.store.set({
      id: 'index',
      data,
      body,
      digest: context.generateDigest(body + JSON.stringify(data)),
      rendered: await context.renderMarkdown(body),
    })
  },
}

const docs = defineCollection({
  loader: project.mode === 'collection' ? collectionDocs : packageDocs,
  schema: z.object({
    title: z.string().trim().min(1),
    titleAccent: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1),
    locale: z.enum(['en']),
    sidebar: z.object({
      group: z.enum(['start', 'guides', 'reference', 'api']),
      order: z.number().int().positive(),
      /** Collection mode: sidebar label; defaults to the title. */
      label: z.string().trim().min(1).optional(),
    }),
  }),
})
export const collections = { docs }
