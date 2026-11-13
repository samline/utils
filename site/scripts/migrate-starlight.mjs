import { realpathSync } from 'node:fs'
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { posix, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

/**
 * Convert a retired Starlight docs tree into this template's collection.
 *
 * scripts/doc-migration.json lists every page explicitly. Each page needs a
 * hand-chosen titleAccent (never derived from the last word), a sidebar group
 * and order. `redirects` maps old public routes to new docs routes; assemble.mjs
 * writes a redirect page for each so old URLs and their fragments keep working.
 *
 * Conversion rules, learned from the Formatter and Drawer migrations:
 * - Relative links resolve against the source page's parent directory
 *   (Starlight authors wrote file-relative links), then map through the manifest
 *   to base-independent links relative to the new page URL.
 * - :::note/tip/caution/danger[Title] asides become the shared Callout.
 * - Starlight <Tabs>/<TabItem> become shared Tabs/TabPanel with dedented content.
 * Review every converted page: this moves content, it does not verify it.
 */

const asideTitles = { note: 'Note', tip: 'Tip', caution: 'Caution', danger: 'Danger' }
const segments = route => (route === 'index' ? 0 : route.split('/').length)
const routeOf = source => source.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '$1index')
const slug = value =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'tab'
const quote = value => `'${String(value).replaceAll("'", "''")}'`
/** A JSX attribute value; YAML-style '' escaping is not valid in JSX. */
const jsx = value => `{${JSON.stringify(String(value))}}`
const dedent = content => {
  const lines = content.replace(/^\n+|\s+$/g, '').split('\n')
  const width = Math.min(
    ...lines.filter(line => line.trim()).map(line => line.match(/^[ \t]*/)[0].length)
  )
  return lines.map(line => line.slice(Number.isFinite(width) ? width : 0)).join('\n')
}
const unquote = value => value.trim().replace(/^(['"])(.*)\1$/, '$2')

/** Rewrite one link target; returns null when the manifest has no destination. */
export function resolveLink(target, { source, destination, routes, base = '/' }) {
  if (/^[a-z][a-z0-9+.-]*:|^#|^\/\//i.test(target)) return target
  const [raw, fragment] = target.split('#')
  // Absolute links may include the old site's base path (/forms/reference/api/).
  const path = base !== '/' && raw.startsWith(base) ? '/' + raw.slice(base.length) : raw
  const from = posix.dirname(source)
  const joined = path.startsWith('/') ? path.slice(1) : posix.join(from, path)
  const key = posix
    .normalize(joined)
    .replace(/\.mdx?$/, '')
    .replace(/\/$/, '')
    .replace(/(^|\/)index$/, '$1')
    .replace(/\/$/, '')
    .replace(/^\.$/, '')
  const route = routes[key || 'index'] ?? routes[key + '/index']
  if (route === undefined) return null
  const up = segments(destination) ? '../'.repeat(segments(destination)) : './'
  const href = route === 'index' ? up : `${up}${route}/`
  return fragment === undefined ? href : `${href}#${fragment}`
}

/** Convert one Starlight page. Returns the new MDX and any unresolved links. */
export function convertStarlight(text, page, routes, base = '/') {
  // PageTitle requires the accent to be the title's trailing phrase. Choose how
  // much of that ending to accent by hand; never default to the last word.
  if (
    !page.titleAccent ||
    !page.title.endsWith(page.titleAccent) ||
    page.titleAccent === page.title
  )
    throw new Error(
      `${page.source}: choose titleAccent by hand: a meaningful trailing phrase of the title, not the whole title. Single-word titles get a second word ("Configuration options").`
    )
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/)
  const frontmatter = match?.[1] ?? ''
  const description =
    page.description ?? unquote(frontmatter.match(/^description:\s*(.+)$/m)?.[1] ?? '')
  let body = text.slice(match?.[0].length ?? 0)
  const unresolved = []
  const needs = new Set()

  body = body.replace(/^import\s+[^;\n]*from\s+['"]@astrojs\/starlight\/components['"];?\n/gm, '')
  body = body.replace(
    /^:::(note|tip|caution|danger)(?:\[([^\]]*)\])?\n([\s\S]*?)^:::\s*$/gm,
    (_, type, title, content) => {
      needs.add('Callout')
      return `<Callout title=${jsx(title || asideTitles[type])}>\n\n${content.trim()}\n\n</Callout>`
    }
  )
  let tabsCount = 0
  body = body.replace(
    /^([ \t]*)<Tabs([^>]*)>\n([\s\S]*?)^\1<\/Tabs>/gm,
    (_, indent, attrs, inner) => {
      needs.add('Tabs').add('TabPanel')
      const items = [
        ...inner.matchAll(/<TabItem\s+label=(["'])(.*?)\1[^>]*>\n([\s\S]*?)<\/TabItem>/g),
      ].map(([, , label, content]) => {
        const lines = content.replace(/\s+$/, '').split('\n')
        const width = Math.min(
          ...lines.filter(line => line.trim()).map(line => line.match(/^[ \t]*/)[0].length)
        )
        return { id: slug(label), label, content: lines.map(line => line.slice(width)).join('\n') }
      })
      const label = attrs.match(/syncKey=(["'])(.*?)\1/)?.[2] ?? 'Alternatives'
      const id = `${slug(page.destination)}-tabs-${++tabsCount}`
      return [
        `<Tabs id=${jsx(id)} label=${jsx(label)} items={${JSON.stringify(items.map(({ id, label }) => ({ id, label })))}}>`,
        ...items.map(
          item =>
            `<TabPanel id=${jsx(item.id)} label=${jsx(item.label)}>\n\n${item.content}\n\n</TabPanel>`
        ),
        '</Tabs>',
      ].join('\n')
    }
  )
  // Starlight cards and steps: CardGrid maps to the shared CardGrid, LinkCard to
  // the shared LinkCard (description becomes its body), Card to a Surface with a
  // bold title, and Steps unwraps to its ordered list.
  const attr = (attrs, name) => attrs.match(new RegExp(`${name}=(["'])(.*?)\\1`))?.[2]
  body = body.replace(/<CardGrid\b[^>]*>/g, () => {
    needs.add('CardGrid')
    return '<CardGrid>'
  })
  body = body.replace(/<LinkCard\b([^>]*?)\/>/g, (_, attrs) => {
    needs.add('LinkCard')
    const description = attr(attrs, 'description')
    return `<LinkCard title=${jsx(attr(attrs, 'title') ?? '')} href="${attr(attrs, 'href') ?? ''}">${description ? `\n${description}\n` : ''}</LinkCard>`
  })
  body = body.replace(/<Card\b([^>]*)>([\s\S]*?)<\/Card>/g, (_, attrs, content) => {
    needs.add('Surface')
    const title = attr(attrs, 'title')
    return `<Surface as="article">\n\n${title ? `**${title}**\n\n` : ''}${dedent(content)}\n\n</Surface>`
  })
  body = body.replace(
    /^[ \t]*<Steps>\n([\s\S]*?)^[ \t]*<\/Steps>[ \t]*\n?/gm,
    (_, content) => `${dedent(content)}\n`
  )
  const rewrite = target => {
    const next = resolveLink(target, {
      source: page.source,
      destination: page.destination,
      routes,
      base,
    })
    if (next === null) unresolved.push(target)
    return next ?? target
  }
  body = body
    .replace(/(\]\()([^)\s]+)(\))/g, (_, open, target, close) => open + rewrite(target) + close)
    .replace(/(href=)(["'])([^"']+)\2/g, (_, attr, q, target) => attr + q + rewrite(target) + q)

  const up = '../'.repeat(3 + Math.max(1, segments(page.destination)))
  const imports = [...needs]
    .sort()
    .map(name => `import ${name} from '${up}shared/components/${name}.astro'`)
  const head = [
    '---',
    'locale: en',
    'sidebar:',
    `  group: ${page.group}`,
    `  order: ${page.order}`,
    `title: ${quote(page.title)}`,
    `titleAccent: ${quote(page.titleAccent)}`,
    `description: ${quote(description)}`,
    '---',
    '',
    // MDX needs a blank line between the import block and the first content.
    ...(imports.length ? [...imports, '', ''] : []),
  ].join('\n')
  return { mdx: head + body.replace(/^\n+/, ''), unresolved, description }
}

export async function migrate(args = process.argv.slice(2)) {
  const { values } = parseArgs({
    args,
    options: {
      source: { type: 'string' },
      manifest: { type: 'string' },
      force: { type: 'boolean' },
      'dry-run': { type: 'boolean' },
    },
  })
  const root = fileURLToPath(new URL('../', import.meta.url))
  const manifest = JSON.parse(
    await readFile(values.manifest ?? join(root, 'scripts/doc-migration.json'), 'utf8')
  )
  const sourceRoot = values.source ?? manifest.source
  if (!sourceRoot)
    throw new Error('Usage: npm run migrate:starlight -- --source ../pkg/src/content/docs')
  const routes = Object.fromEntries(
    manifest.pages.map(page => [
      routeOf(page.source)
        .replace(/(^|\/)index$/, '$1')
        .replace(/\/$/, '') || 'index',
      page.destination,
    ])
  )
  const problems = []
  for (const page of manifest.pages) {
    const text = await readFile(resolve(sourceRoot, page.source), 'utf8')
    const { mdx, unresolved, description } = convertStarlight(
      text,
      page,
      routes,
      manifest.base ?? '/'
    )
    if (unresolved.length)
      problems.push(`${page.source}: unresolved links ${unresolved.join(', ')}`)
    if (description.length < 70) problems.push(`${page.source}: description under 70 characters`)
    const target = join(root, 'docs/src/content/docs', `${page.destination}.mdx`)
    if (values['dry-run']) {
      console.log(`--- ${page.source} → ${page.destination}.mdx\n${mdx}`)
      continue
    }
    const present = await access(target).then(
      () => true,
      () => false
    )
    if (present && !values.force) {
      problems.push(`${page.destination}.mdx exists; pass --force after reviewing it`)
      continue
    }
    await mkdir(join(target, '..'), { recursive: true })
    await writeFile(target, mdx)
  }
  if (problems.length) {
    console.error(problems.map(problem => `✗ ${problem}`).join('\n'))
    process.exitCode = 1
  }
  console.log(
    `Converted ${manifest.pages.length} pages; ${Object.keys(manifest.redirects ?? {}).length} redirects are emitted by assemble.mjs. Review every page, then run npm run build.`
  )
}

if (process.argv[1] && fileURLToPath(import.meta.url) === realpathSync(process.argv[1]))
  migrate().catch(error => {
    console.error(error.message)
    process.exitCode = 1
  })
