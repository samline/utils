import { identityFor, isCollection } from '../../../shared/lib/identity'
const routes = {
  overview: '',
  setup: 'getting-started/',
  options: 'reference/configuration/',
  api: 'reference/api/',
  lifecycle: 'reference/configuration/',
  accessibility: 'guides/accessibility/',
  examples: 'guides/examples/',
  changelog: 'changelog/',
} as const
export type DocsRoute = keyof typeof routes
type AstroLike = Parameters<typeof identityFor>[0]
/** Docs URL for the page's identity: the package in collection mode, else the site. */
export const docsHref = (route: DocsRoute, astro?: AstroLike) => {
  const identity = identityFor(astro)
  const path = routes[route]
  // A collection package documents only the articles it has; other routes
  // fall back to its docs overview instead of a broken link.
  if ('docs' in identity && !identity.docs.includes(path)) return identity.docsHome
  // Site-level pages of a collection have no guides of their own: the docs
  // overview lists every package.
  if (isCollection && !identity.slug) return identity.docsHome
  return identity.docsHome + path
}
