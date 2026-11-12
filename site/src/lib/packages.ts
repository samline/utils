/**
 * The catalog is generated from the workspace: every non-private package with
 * a `site.json` appears automatically, with its real npm name, version and
 * description.
 */

interface Manifest {
  name: string
  version: string
  description: string
  private?: boolean
}

interface SiteMeta {
  title: string
  category: string
  summary: string
  tags: string[]
}

export interface CatalogEntry extends SiteMeta {
  slug: string
  npm: string
  version: string
  description: string
}

const manifests = import.meta.glob<Manifest>('../../../packages/*/package.json', {
  eager: true,
  import: 'default',
})
const metas = import.meta.glob<SiteMeta>('../../../packages/*/site.json', {
  eager: true,
  import: 'default',
})

const slugOf = (path: string) => path.split('/').at(-2)!

export const catalog: CatalogEntry[] = Object.entries(manifests)
  .flatMap(([path, manifest]) => {
    const slug = slugOf(path)
    const meta = metas[path.replace('package.json', 'site.json')]
    if (manifest.private || !meta) return []
    return [
      {
        ...meta,
        slug,
        npm: manifest.name,
        version: manifest.version,
        description: manifest.description,
      },
    ]
  })
  .sort((a, b) => a.title.localeCompare(b.title))

export const categories = [...new Set(catalog.map(entry => entry.category))].sort()

export const withBase = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`
