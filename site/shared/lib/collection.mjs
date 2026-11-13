// Node-only registry for collection mode (see .agents/collection-mode.md).
// Build scripts and Astro configs read packages from disk here; pages read the
// generated shared/generated/collection.json so no filesystem code reaches a
// page bundle.
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { project } from './project.mjs'

/** The site root: the directory that holds project.config.json. */
export const siteRoot = new URL('../../', import.meta.url)

/** Absolute path of the collection's packages directory, or null in package mode. */
export const packagesDir = project.collection
  ? fileURLToPath(new URL(project.collection.packagesDir.replace(/\/?$/, '/'), siteRoot)).replace(
      /\/$/,
      ''
    )
  : null

const readJson = (path, label) => {
  if (!existsSync(path)) throw new Error(`Collection package ${label} is missing ${path}`)
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch (error) {
    throw new Error(`Collection package ${label} has invalid JSON in ${path}: ${error.message}`)
  }
}

const requireText = (value, field, label) => {
  if (typeof value !== 'string' || !value.trim())
    throw new Error(`Collection package ${label} needs a non-empty ${field}`)
  return value.trim()
}

/** Docs routes a package provides, relative to its docs home ('' is the index). */
const docsRoutes = dir => {
  const base = `${dir}/site/docs`
  if (!existsSync(base)) return ['changelog/']
  const routes = readdirSync(base, { recursive: true })
    .map(String)
    .filter(file => /\.mdx?$/.test(file))
    .map(file =>
      file
        .replace(/\\/g, '/')
        .replace(/\.mdx?$/, '')
        .replace(/(^|\/)index$/, '$1')
    )
    .map(route => (route && !route.endsWith('/') ? `${route}/` : route))
  return [...new Set([...routes, 'changelog/'])].sort()
}

/** Read and validate one package of the collection. */
export function readCollectionPackage(slug) {
  if (!packagesDir) throw new Error('readCollectionPackage requires mode: "collection"')
  const dir = `${packagesDir}/${slug}`
  const manifest = readJson(`${dir}/package.json`, slug)
  const meta = readJson(`${dir}/site/meta.json`, slug)
  for (const file of ['landing.ts', 'Demo.astro', 'SKILL.md'])
    if (!existsSync(`${dir}/site/${file}`))
      throw new Error(
        `Collection package ${slug} needs site/${file} (see .agents/collection-mode.md)`
      )
  if (manifest.private) throw new Error(`Collection package ${slug} is private`)
  const npmName = requireText(manifest.name, 'package.json name', slug)
  const tags = meta.tags ?? []
  if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string' && tag.trim()))
    throw new Error(`Collection package ${slug} needs site/meta.json tags as strings`)
  const delivery = { cdnScript: null, cdnStylesheet: null, ...meta.delivery }
  for (const value of Object.values(delivery))
    if (value !== null && !/^https?:\/\//.test(value))
      throw new Error(`Collection package ${slug} needs HTTP(S) delivery URLs or null`)
  return {
    slug,
    name: requireText(meta.title, 'site/meta.json title', slug),
    npmName,
    version: requireText(manifest.version, 'package.json version', slug),
    description: requireText(manifest.description, 'package.json description', slug),
    license: requireText(manifest.license, 'package.json license', slug),
    author: project.author,
    keywords: Array.isArray(manifest.keywords) ? manifest.keywords : project.keywords,
    category: requireText(meta.category, 'site/meta.json category', slug),
    summary: requireText(meta.summary, 'site/meta.json summary', slug),
    tags,
    delivery,
    skill: npmName.replace(/^@[^/]+\//, ''),
    home: `${project.base}${slug}/`,
    docsHome: `${project.docsBase}${slug}/`,
    hasDemo: existsSync(`${dir}/site/Demo.astro`),
    hasExamples: existsSync(`${dir}/site/examples.ts`),
    docs: docsRoutes(dir),
  }
}

/** Every package of the collection in catalog order; empty in package mode. */
export const readCollection = () => (project.collection?.packages ?? []).map(readCollectionPackage)

/**
 * Vite aliases for collection mode:
 * - `@collection/...` globs resolve into the packages directory (package mode
 *   points it at an empty generated directory, so the same globs match nothing);
 * - each package's npm name resolves to its directory, so previews import the
 *   real package through its package.json exports. Build the packages first.
 */
export const collectionAlias = [
  {
    find: '@collection',
    replacement: packagesDir ?? fileURLToPath(new URL('../generated/no-packages', import.meta.url)),
  },
  ...readCollection().map(item => ({
    find: new RegExp(`^${item.npmName.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}$`),
    replacement: `${packagesDir}/${item.slug}`,
  })),
]
