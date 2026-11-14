import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { JSDOM, VirtualConsole } from 'jsdom'
import type { Page } from '@playwright/test'

export type LoadingMode = 'cdn' | 'esm'
export type FileVariant = 'complete' | 'split'
const root = fileURLToPath(new URL('../', import.meta.url))
const documents = new Map<string, Promise<Document>>()

/** Read the exact source rendered by Astro, including hidden file/mode tabs. */
export const openCopiedFiles = async (
  page: Page,
  slug: string,
  id: string,
  mode: LoadingMode,
  variant: FileVariant
) => {
  const path = `${root}landing/dist/${slug}/examples/index.html`
  if (!documents.has(path))
    documents.set(
      path,
      readFile(path, 'utf8').then(html => new JSDOM(html, { virtualConsole: new VirtualConsole() }).window.document)
    )
  const document = await documents.get(path)!
  const panel = document.querySelector(
    `[data-package-example="${slug}/${id}"] [data-package-code] [data-panel="${mode}"]`
  )
  if (!panel) throw new Error(`Missing ${mode} code for ${id}`)
  const code = (file: string) =>
    panel.querySelector(`[data-panel="${file}"] code`)?.textContent ?? ''
  let html = code(variant === 'complete' ? 'complete' : 'html')
  let javascript = code('javascript')
  const files: Record<string, { body: string; contentType: string }> = {
    'style.css': { body: code('css'), contentType: 'text/css' },
  }
  if (mode === 'esm') {
    if (variant === 'complete') {
      const script = new JSDOM(html, { virtualConsole: new VirtualConsole() }).window.document.querySelector('script[type="module"]')
      javascript = script?.textContent ?? ''
    }
    const result = await build({
      stdin: { contents: javascript, resolveDir: root, sourcefile: 'main.js' },
      alias: Object.fromEntries([
        ...['counter', 'debounce', 'horizontal-scroll', 'is-visible', 'reveal', 'scroll-spy', 'scroll-to', 'string', 'theme'].map(name => [`@samline/${name}`, `${root}../packages/${name}/dist/index.js`]),
        ['@samline/reveal/style.css', `${root}../packages/reveal/dist/style.css`],
      ]),
      nodePaths: [`${root}../node_modules`],
      bundle: true,
      format: 'esm',
      write: false,
      outfile: '/tmp/copied-example/main.js',
    })
    javascript = result.outputFiles.find(file => file.path.endsWith('.js'))!.text
    files['bundle.css'] = {
      body: result.outputFiles.find(file => file.path.endsWith('.css'))?.text ?? '',
      contentType: 'text/css',
    }
    html = html.replace('</head>', '<link rel="stylesheet" href="./bundle.css"></head>')
    if (variant === 'complete')
      html = html.replace(
        /<script type="module">[\s\S]*?<\/script>/,
        '<script type="module" src="./main.js"></script>'
      )
  }
  files['main.js'] = { body: javascript, contentType: 'text/javascript' }
  const url = `http://copied-example.test/${slug}/${id}/${mode}/${variant}/`
  await page.route(`${url}**`, route => {
    const filename = new URL(route.request().url()).pathname.split('/').pop()!
    return route.fulfill(files[filename] ?? { body: html, contentType: 'text/html' })
  })
  await page.route('https://cdn.jsdelivr.net/npm/@samline/**', async route => {
    const request = new URL(route.request().url()).pathname
    const match = request.match(/@samline\/([^@]+)@[^/]+\/dist\/(.*)/)
    if (!match) throw new Error(`Unexpected CDN URL: ${request}`)
    await route.fulfill({ path: `${root}../packages/${match[1]}/dist/${match[2]}` })
  })
  await page.goto(url)
}
