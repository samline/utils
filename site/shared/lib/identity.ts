// Page identity for both modes (see .agents/collection-mode.md).
// Package mode: every page is the configured package. Collection mode: pages
// under /<package>/ (and docs under /docs/<package>/) describe that package;
// every other page describes the collection itself.
import registry from '../generated/collection.json'
import { project } from './project.mjs'

export interface CollectionPackage {
  slug: string
  name: string
  npmName: string
  version: string
  description: string
  license: string
  author: string
  keywords: string[]
  category: string
  summary: string
  tags: string[]
  /** Up to three short capabilities shown on the catalog card. */
  highlights: string[]
  /** Size shown on the catalog card, such as "1.8 KB gzip". */
  size: string | null
  /** Inline catalog preview from site/card.svg. */
  art: string | null
  delivery: { cdnScript: string | null; cdnStylesheet: string | null }
  skill: string
  home: string
  docsHome: string
  hasDemo: boolean
  hasExamples: boolean
  /** Docs routes the package provides, relative to docsHome ('' is the index). */
  docs: string[]
}

export const isCollection = project.mode === 'collection'
export const collectionPackages = registry.packages as CollectionPackage[]

export const findPackage = (slug: string) => {
  const found = collectionPackages.find(item => item.slug === slug)
  if (!found) throw new Error(`Unknown collection package "${slug}"`)
  return found
}

type AstroLike = { params?: Record<string, string | undefined> }

/**
 * The package a page belongs to, or undefined for site-level pages: the
 * `package` route param on Home and Examples, or the first `slug` segment of a
 * Docs article (`/docs/<package>/...`).
 */
export const packageSlug = (astro?: AstroLike): string | undefined => {
  if (!isCollection) return undefined
  const direct = astro?.params?.package
  if (direct) return direct
  const first = astro?.params?.slug?.split('/')[0]
  return first && collectionPackages.some(item => item.slug === first) ? first : undefined
}

/**
 * Identity fields used by SEO, install commands, footer links and skills.
 * `home` and `docsHome` are where this identity's Home and Docs start.
 */
export const identityFor = (astro?: AstroLike) => {
  const slug = packageSlug(astro)
  if (!slug)
    return {
      ...project,
      slug: null as string | null,
      home: project.base,
      docsHome: project.docsBase,
    }
  const item = findPackage(slug)
  return { ...project, ...item, slug: item.slug as string | null }
}

export type Identity = ReturnType<typeof identityFor>
