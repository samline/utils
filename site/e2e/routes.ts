// Routes of the package under test. In package mode that is the site itself;
// in collection mode (see .agents/collection-mode.md) it is the first package
// of the collection, whose Home, Examples and Docs live under its slug, while
// the site root is the catalog.
import { readFileSync } from 'node:fs'
import { project } from '../shared/lib/project.mjs'

export const collection = project.mode === 'collection'

type Registry = {
  packages: Array<{
    slug: string
    name: string
    npmName: string
    skill: string
    delivery: typeof project.delivery
    hasExamples: boolean
    docs: string[]
  }>
}
/** The generated collection registry (scripts/assets.mjs), empty in package mode. */
export const registry: Registry = collection
  ? JSON.parse(
      readFileSync(new URL('../shared/generated/collection.json', import.meta.url), 'utf8')
    )
  : { packages: [] }

const first = collection ? registry.packages[0] : undefined
if (collection && !first) throw new Error('Collection mode needs at least one package')

/** The package the specs exercise. */
export const target = first
  ? {
      slug: first.slug,
      name: first.name,
      npmName: first.npmName,
      skill: first.skill,
      delivery: first.delivery,
    }
  : {
      slug: null,
      name: project.name,
      npmName: project.npmName,
      skill: project.skill,
      delivery: project.delivery,
    }

/** Relative to the site base: Home, Examples and the docs overview of that package. */
export const home = first ? `${first.slug}/` : './'
export const examples = first ? `${first.slug}/examples/` : 'examples/'
export const docs = first ? `docs/${first.slug}/` : 'docs/'

/** A docs article of that package; collection packages have their own installation page. */
export const docsPage = (route: string) => `${docs}${route}`

/** Absolute paths, as rendered in links. */
export const base = project.base
export const homePath = `${project.base}${first ? `${first.slug}/` : ''}`
