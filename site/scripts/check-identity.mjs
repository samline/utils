import { readFile, readdir, access } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkReadme, checkPageIdentity } from './lib/identity-checks.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
const packageRoot = args.includes('--package-root')
  ? resolve(root, args[args.indexOf('--package-root') + 1])
  : root
let config
try {
  config = JSON.parse(await readFile(join(root, 'project.config.json'), 'utf8'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const manifest = JSON.parse(await readFile(join(packageRoot, 'package.json'), 'utf8'))
const npmName = config?.package.npmName ?? manifest.name
const siteUrl = config?.site.url ?? manifest.homepage
const repository = String(
  config?.site.repository ?? manifest.repository?.url ?? manifest.repository
)
  .replace(/^git\+/, '')
  .replace(/\.git$/, '')
const credit = config?.site.credit ?? new URL(repository).pathname.split('/').filter(Boolean)[0]
// Collection mode (see .agents/collection-mode.md): every package README and
// every package page follows the contract with that package's own npm name.
const collection =
  config?.mode === 'collection'
    ? JSON.parse(await readFile(join(root, 'shared/generated/collection.json'), 'utf8')).packages
    : []
const packagesDir = config?.collection ? resolve(root, config.collection.packagesDir) : null
const problems = collection.length
  ? (
      await Promise.all(
        collection.map(async item =>
          checkReadme(await readFile(join(packagesDir, item.slug, 'README.md'), 'utf8'), {
            npmName: item.npmName,
            siteUrl: new URL(`${item.slug}/`, siteUrl).href,
            credit,
            template: false,
            cdn: !!item.delivery.cdnScript,
            links: {
              examples: item.hasExamples ? new URL(`${item.slug}/examples/`, siteUrl).href : null,
              docs: new URL(`docs/${item.slug}/`, siteUrl).href,
              skillDownload: new URL(`skills/${item.skill}/SKILL.md`, siteUrl).href,
              skillSource: 'site/SKILL.md',
            },
          }).map(problem => `${item.slug}/README.md: ${problem}`)
        )
      )
    ).flat()
  : checkReadme(await readFile(join(packageRoot, 'README.md'), 'utf8'), {
      npmName,
      siteUrl,
      credit,
      template: manifest.private === true,
      cdn: config ? !!config.delivery.cdnScript : !!manifest.exports?.['./browser/global'],
    })
const packageOf = local =>
  collection.find(
    item => local.startsWith(`${item.slug}/`) || local.startsWith(`docs/${item.slug}/`)
  )
const dist = join(root, 'landing/dist')
await access(join(dist, 'index.html'))
let total = 0
const walk = async directory => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['pagefind', '_astro', 'font-licenses'].includes(entry.name)) continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await walk(path)
      continue
    }
    if (!entry.name.endsWith('.html')) continue
    const html = await readFile(path, 'utf8')
    if (/http-equiv="refresh"/i.test(html)) continue
    const local = path.slice(dist.length + 1)
    const owner = packageOf(local)
    const relative = owner ? local.slice(owner.slug.length + 1) : local
    problems.push(
      ...checkPageIdentity(html, {
        npmName: owner?.npmName ?? npmName,
        credit,
        footer:
          !local.startsWith('docs/') && ['index.html', 'examples/index.html'].includes(relative),
        subject: owner
          ? { 'examples/index.html': 'Examples' }[relative]
          : { 'examples/index.html': 'Examples', 'docs/index.html': 'Documentation' }[local],
      }).map(problem => `${local}: ${problem}`)
    )
    total++
  }
}
await walk(dist)
if (problems.length) {
  console.error(problems.map(problem => `✗ ${problem}`).join('\n'))
  process.exitCode = 1
} else
  console.log(
    `README, ${total} document/social titles and both branded footers follow the identity contract.`
  )
