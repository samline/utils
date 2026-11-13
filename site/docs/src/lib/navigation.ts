import { getCollection } from 'astro:content'
import { getI18n, getLocale } from '../i18n/utils'
import { isCollection } from '../../../shared/lib/identity'
const groupIds = ['start', 'guides', 'reference', 'api'] as const
/**
 * Sidebar groups. In collection mode pass the page's package: only its
 * articles are listed, labelled by their frontmatter (sidebar.label or title).
 */
export async function getNavigation(currentLocale?: string, packageSlug?: string) {
  const locale = getLocale(currentLocale),
    t = getI18n({ currentLocale: locale })
  const entries = await getCollection(
    'docs',
    entry =>
      entry.data.locale === locale &&
      (packageSlug
        ? entry.id.startsWith(`${packageSlug}/`) || entry.id === packageSlug
        : !isCollection || entry.id === 'index')
  )
  const positions = new Set<string>()
  for (const entry of entries) {
    const position = `${entry.data.sidebar.group}/${entry.data.sidebar.order}`
    if (positions.has(position)) throw new Error(`Duplicate sidebar order: ${position}`)
    positions.add(position)
  }
  return groupIds
    .map(id => ({
      id,
      label: t.groupLabels[id],
      pages: entries
        .filter(entry => entry.data.sidebar.group === id)
        .sort((a, b) => a.data.sidebar.order - b.data.sidebar.order)
        .map(entry => {
          const label = packageSlug
            ? (entry.data.sidebar.label ?? entry.data.title)
            : t.pageLabels[entry.id as keyof typeof t.pageLabels]
          if (!label) throw new Error(`Missing navigation translation for ${entry.id}`)
          return [entry.id, label] as const
        }),
    }))
    .filter(group => group.pages.length > 0)
}
