import { identityFor, isCollection } from '../../../shared/lib/identity'
import { docsHref, type DocsRoute } from './docs'
type Item = { href: string } | { docsRoute: DocsRoute } | { page: 'examples' }
type AstroLike = Parameters<typeof identityFor>[0]
/** The Home of the page's identity: a package Home in collection mode, else the site. */
export const homeHref = (astro?: AstroLike) => identityFor(astro).home
/** Collection discovery uses Home; packages without examples fall back to their docs. */
export const examplesHref = (astro?: AstroLike) => {
  const identity = identityFor(astro)
  if (isCollection && !identity.slug) return `${identity.home}#catalog`
  if ('hasExamples' in identity && !identity.hasExamples) return identity.docsHome
  return `${identity.home}examples/`
}
export function isHome(pathname: string, astro?: AstroLike) {
  return pathname.replace(/\/$/, '') === homeHref(astro).replace(/\/$/, '')
}
export function navigationHref(item: Item, pathname: string, astro?: AstroLike): string {
  if ('docsRoute' in item) return docsHref(item.docsRoute, astro)
  if ('page' in item) return examplesHref(astro)
  return isHome(pathname, astro) ? item.href : `${homeHref(astro)}${item.href}`
}
