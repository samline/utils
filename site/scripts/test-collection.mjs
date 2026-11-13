// Builds the website in collection mode against tests/fixtures/collection and
// checks the generated routes, identity and copied example files.
// See .agents/collection-mode.md.
import assert from 'node:assert/strict'
import { cp, mkdtemp, readFile, rm, symlink, writeFile, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = fileURLToPath(new URL('../', import.meta.url))
const temporary = await mkdtemp(join(tmpdir(), 'package-site-collection-'))
const ignored = new Set([
  '.git',
  'node_modules',
  'dist',
  '.astro',
  'test-results',
  'playwright-report',
])
const exists = path =>
  access(path).then(
    () => true,
    () => false
  )
try {
  await cp(root, temporary, { recursive: true, filter: path => !ignored.has(basename(path)) })
  await symlink(join(root, 'node_modules'), join(temporary, 'node_modules'), 'dir')
  const config = JSON.parse(await readFile(join(temporary, 'project.config.json'), 'utf8'))
  config.mode = 'collection'
  config.collection = {
    packagesDir: 'tests/fixtures/collection/packages',
    packages: ['alpha', 'beta'],
  }
  config.package = {
    ...config.package,
    name: 'Fixture Kit',
    npmName: '@fixture/kit',
    description:
      'A collection fixture with two packages, used to verify collection mode end to end.',
  }
  config.site = { ...config.site, url: 'https://example.com/kit/', namespace: 'fixture-kit' }
  await writeFile(join(temporary, 'project.config.json'), JSON.stringify(config, null, 2))
  try {
    execFileSync('npm', ['run', 'build'], { cwd: temporary, stdio: 'pipe' })
  } catch (error) {
    const tail = buffer =>
      String(buffer ?? '')
        .split('\n')
        .slice(-40)
        .join('\n')
    throw new Error(`Collection build failed:\n${tail(error.stdout)}\n${tail(error.stderr)}`)
  }

  const dist = join(temporary, 'landing/dist')
  const page = path => readFile(join(dist, path), 'utf8')
  const title = html => html.match(/<title>([^<]*)<\/title>/)?.[1]

  const home = await page('index.html')
  assert.match(home, /Fixture Kit/)
  assert.match(home, /href="\/kit\/alpha\/"/)
  assert.match(home, /href="\/kit\/beta\/"/)
  assert.equal(title(home), 'Utilities, examples and documentation — @fixture/kit')

  const alpha = await page('alpha/index.html')
  assert.match(alpha, /ALPHA PREVIEW/)
  assert.equal(title(alpha), 'Uppercase text in the browser — @fixture/alpha')
  assert.match(alpha, /npm install @fixture\/alpha/)
  assert.match(alpha, /href="\/kit\/docs\/alpha\/getting-started\//)

  const examples = await page('alpha/examples/index.html')
  assert.match(examples, /<p data-fixture-example[^>]*>HELLO<\/p>/)
  assert.match(examples, /toUpperCase/)
  assert.match(examples, /cdn\.example\.com\/alpha@1\.2\.3/)
  assert.equal(await exists(join(dist, 'beta/examples/index.html')), false)

  for (const route of [
    'docs/index.html',
    'docs/alpha/index.html',
    'docs/alpha/getting-started/index.html',
    'docs/alpha/changelog/index.html',
    'docs/beta/index.html',
    'docs/beta/changelog/index.html',
  ])
    assert.ok(await exists(join(dist, route)), `${route} is generated`)
  const docsIndex = await page('docs/index.html')
  assert.match(docsIndex, /href="\/kit\/docs\/alpha\/"/)
  const alphaDocs = await page('docs/alpha/getting-started/index.html')
  assert.match(alphaDocs, /Installation/)
  assert.doesNotMatch(alphaDocs, /docs\/beta\//, 'package docs only list their own articles')
  assert.equal(title(alphaDocs), 'Installation — @fixture/alpha')

  assert.match(await page('skills/alpha/SKILL.md'), /# Alpha skill/)
  assert.match(await page('skills/beta/SKILL.md'), /# Beta skill/)
  console.log('Collection mode: catalog, package Home/Examples/Docs and skills verified.')
} finally {
  if (process.env.KEEP_COLLECTION_FIXTURE) console.log('Kept', temporary)
  else await rm(temporary, { recursive: true, force: true })
}
