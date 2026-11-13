// Collection mode examples (see .agents/collection-mode.md).
// A package lists its examples in <packagesDir>/<package>/site/examples.ts and
// renders each live preview in site/examples/<id>.astro with the real package.
// The copied files below are tested in a browser, so they cannot drift from
// the preview without a failing check.
import { format, resolveConfig } from 'prettier'
import controls from '../i18n/translations/en/controls'
import { findPackage } from './identity'
import { project } from './project.mjs'

export interface PackageExample {
  readonly id: string
  /** Short navigation label. */
  readonly tab: string
  /** The visitor's task, used as the section heading. */
  readonly title: string
  readonly description: string
  readonly files: { readonly html: string; readonly css?: string; readonly js: string }
}

const records = {
  ...import.meta.glob<readonly PackageExample[]>('@collection/*/site/examples.ts', {
    eager: true,
    import: 'default',
  }),
  // Package mode: <site root>/site/examples.ts (see collection-mode.md).
  ...import.meta.glob<readonly PackageExample[]>('@package-site/examples.ts', {
    eager: true,
    import: 'default',
  }),
}
const previews = {
  ...import.meta.glob<{ default: unknown }>('@collection/*/site/examples/*.astro', { eager: true }),
  ...import.meta.glob<{ default: unknown }>('@package-site/examples/*.astro', { eager: true }),
}

/** Path prefix of a package's site folder: `/<slug>/site/` or, in package mode, `/site/`. */
const folder = (slug?: string | null) => (slug ? `/${slug}/site/` : '/site/')

const options = await resolveConfig(process.cwd())

const keyFor = <T>(map: Record<string, T>, suffix: string) =>
  Object.keys(map).find(path => path.endsWith(suffix))

/** The examples a collection package (or, without a slug, the site's package) declares. */
export const examplesFor = (slug?: string | null): readonly PackageExample[] => {
  const key = keyFor(records, `${folder(slug)}examples.ts`)
  if (!key) return []
  const list = records[key]!
  const ids = new Set<string>()
  for (const item of list) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(item.id))
      throw new Error(`${slug} example ids must be lowercase slugs: "${item.id}"`)
    if (ids.has(item.id)) throw new Error(`${slug} repeats the example id "${item.id}"`)
    ids.add(item.id)
    if (!keyFor(previews, `${folder(slug)}examples/${item.id}.astro`))
      throw new Error(`${slug ?? 'site'} example "${item.id}" needs site/examples/${item.id}.astro`)
  }
  return list
}

/** The live preview component of one example. */
export const previewFor = (slug: string | null | undefined, id: string) =>
  previews[keyFor(previews, `${folder(slug)}examples/${id}.astro`)!]!.default as (
    props: Record<string, unknown>
  ) => unknown

const documentFor = (
  slug: string | null | undefined,
  example: PackageExample,
  separate: boolean
) => {
  const { cdnScript, cdnStylesheet } = slug ? findPackage(slug).delivery : project.delivery
  const css = example.files.css?.trim()
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${example.title}</title>`,
    cdnStylesheet ? `<link rel="stylesheet" href="${cdnStylesheet}">` : '',
    css
      ? separate
        ? '<link rel="stylesheet" href="./style.css">'
        : `<style>\n${css}\n</style>`
      : '',
  ]
  const scripts = [
    cdnScript ? `<script src="${cdnScript}"></script>` : '',
    separate
      ? '<script src="./main.js" defer></script>'
      : `<script>\n${example.files.js}\n</script>`,
  ]
  return `<!doctype html>\n<html lang="en">\n<head>\n${head.filter(Boolean).join('\n')}\n</head>\n<body>\n<main>\n${example.files.html}\n</main>\n${scripts.filter(Boolean).join('\n')}\n</body>\n</html>`
}

/** Formatted, copyable files for one example: separate files plus one complete document. */
export const filesFor = async (slug: string | null | undefined, example: PackageExample) => {
  const files = [
    {
      id: 'html',
      label: controls.codeFiles.html,
      filename: 'index.html',
      language: 'html' as const,
      code: await format(documentFor(slug, example, true), { ...options, parser: 'html' }),
    },
    ...(example.files.css?.trim()
      ? [
          {
            id: 'css',
            label: controls.codeFiles.css,
            filename: 'style.css',
            language: 'css' as const,
            code: await format(example.files.css, { ...options, parser: 'css' }),
          },
        ]
      : []),
    {
      id: 'javascript',
      label: controls.codeFiles.javascript,
      filename: 'main.js',
      language: 'javascript' as const,
      code: await format(example.files.js, { ...options, parser: 'babel' }),
    },
  ]
  const complete = await format(documentFor(slug, example, false), { ...options, parser: 'html' })
  return { files, complete }
}
