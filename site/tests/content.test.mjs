import test from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { checkContent, README_HEADINGS, DEFAULT_ICONS } from '../scripts/check-content.mjs'

const project = {
  name: 'Widget',
  npmName: '@example/widget',
  skill: 'widget',
  version: '3.2.1',
  delivery: { cdnScript: 'https://cdn.example.com/widget@3.2.1/global.js' },
}
const skillLink = '<a href="/skills/widget/SKILL.md" download="SKILL.md">Widget skill</a>'
const page = (title, description, body = '') =>
  `<html><head><title>${title}</title><meta name="description" content="${description}"></head><body>${body}${skillLink}</body></html>`
const faq = Array.from({ length: 8 }, () => '<details class="faq-item"></details>').join('')
const skill = `---\nname: widget\ndescription: Integrate @example/widget.\n---\n\n# Widget 3.2.1\n`
const readme = `# @example/widget\n\nTagline.\n\n${README_HEADINGS.map(h => `## ${h}\n\n${h === 'AI agent skill' ? 'skills/widget/SKILL.md' : h === 'License' ? 'MIT — [LICENSE.md](LICENSE.md)' : 'Text.'}\n`).join('\n')}`

const fixture = async (changes = {}) => {
  const root = await mkdtemp(join(tmpdir(), 'package-site-content-'))
  const files = {
    'landing/dist/index.html': page(
      'Widget: accessible widgets for the web',
      'Widget renders accessible, dependency-free widgets for any web page, with one small API.',
      faq
    ),
    'landing/dist/examples/index.html': page(
      'Widget examples: live previews and code',
      'Try live Widget previews for distinct tasks, then copy separate files or one complete document.'
    ),
    'landing/dist/skills/widget/SKILL.md': skill,
    'skills/widget/SKILL.md': skill,
    'landing/src/sections/Features.astro': '<svg><path d="M1 1h2"></path></svg>',
    'README.md': readme,
    'LICENSE.md': 'MIT',
    'AGENTS.md': '# Memory',
    'SITE.md': '# Site',
    'package.json': JSON.stringify({
      name: '@example/widget',
      packageManager: 'npm@11.0.0',
      files: ['dist'],
      scripts: { 'test:package': 'node test.mjs' },
    }),
    ...changes,
  }
  for (const [path, body] of Object.entries(files)) {
    if (body === null) continue
    await mkdir(join(root, path, '..'), { recursive: true })
    await writeFile(join(root, path), body)
  }
  execFileSync('git', ['init', '-q'], { cwd: root })
  execFileSync('git', ['add', 'AGENTS.md'], { cwd: root })
  return root
}
const run = async (changes, options = {}) => {
  const root = await fixture(changes)
  try {
    return await checkContent({ root, project, release: true, ...options })
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}

test('a complete adapted site passes every release content check', async () => {
  assert.deepEqual(await run(), [])
})

for (const [name, changes, message] of [
  [
    'a short title',
    {
      'landing/dist/examples/index.html': page(
        'Widget examples.',
        'Try live Widget previews for distinct tasks, then copy separate files or one complete document.'
      ),
    },
    /shorter than 20/,
  ],
  [
    'a short description',
    {
      'landing/dist/examples/index.html': page('Widget examples: live previews', 'Too short.'),
    },
    /meta description has 10/,
  ],
  [
    'duplicate descriptions',
    {
      'landing/dist/examples/index.html': page(
        'Widget examples: live previews and code',
        'Widget renders accessible, dependency-free widgets for any web page, with one small API.'
      ),
    },
    /duplicate description/,
  ],
  [
    'starter copy',
    {
      'landing/dist/examples/index.html': page(
        'Widget examples: live previews and code',
        'Try live Widget previews for distinct tasks, then copy separate files or one complete document.',
        'A working interaction'
      ),
    },
    /template default text remains/,
  ],
  [
    'a default Overview icon',
    { 'landing/src/sections/Features.astro': `<path d="${DEFAULT_ICONS.eye}"></path>` },
    /default "eye" icon/,
  ],
  [
    'a shallow FAQ',
    {
      'landing/dist/index.html': page(
        'Widget: accessible widgets for the web',
        'Widget renders accessible, dependency-free widgets for any web page, with one small API.'
      ),
    },
    /FAQ items/,
  ],
  [
    'a Docs example guide that sends readers to Examples for code',
    {
      'landing/dist/docs/guides/examples/index.html': page(
        'Widget examples guide · Widget docs',
        'Every Widget preview with its explanation and its complete copyable HTML, CSS and JavaScript files.',
        '<a href="/examples/#slug">Copy the files</a>'
      ),
    },
    /links to Examples for code/,
  ],
  ['a missing package skill', { 'skills/widget/SKILL.md': null }, /Missing skills\/widget/],
  [
    'the starter skill',
    {
      'skills/widget/SKILL.md': skill + '<!-- package-site:starter-skill -->\n',
      'landing/dist/skills/widget/SKILL.md': skill + '<!-- package-site:starter-skill -->\n',
    },
    /still the starter/,
  ],
  [
    'a link to the adaptation skill',
    {
      'landing/dist/examples/index.html': page(
        'Widget examples: live previews and code',
        'Try live Widget previews for distinct tasks, then copy separate files or one complete document.',
        '<a href="/skills/package-site/SKILL.md">skill</a>'
      ),
    },
    /template adaptation skill/,
  ],
  [
    'README headings out of sibling order',
    { 'README.md': readme.replace('## Capabilities', '## Features') },
    /H2 headings/,
  ],
  ['a bare LICENSE file', { LICENSE: 'MIT' }, /Rename LICENSE/],
  [
    'a SITE-LICENSE.md that duplicates LICENSE.md',
    { 'SITE-LICENSE.md': 'MIT' },
    /Remove SITE-LICENSE\.md/,
  ],
  [
    'a merged site postinstall',
    {
      'package.json': JSON.stringify({
        name: '@example/widget',
        packageManager: 'npm@11.0.0',
        files: ['dist'],
        scripts: { 'test:package': 'x', postinstall: 'node site-tools/assets.mjs' },
      }),
    },
    /postinstall/,
  ],
])
  test(`release content checks reject ${name}`, async () => {
    const problems = await run(changes)
    assert.ok(
      problems.some(problem => message.test(problem)),
      problems.join('\n')
    )
  })

test('an explicitly reviewed default icon may stay', async () => {
  const changes = {
    'landing/src/sections/Features.astro': `<path d="${DEFAULT_ICONS.eye}"></path>`,
  }
  assert.deepEqual(await run(changes, { audit: { iconReview: { kept: ['eye'] } } }), [])
})

test('LICENSE.md names the configured package author', async () => {
  const author = 'Ada Lovelace (ada)'
  const license = holder =>
    `MIT License\n\nCopyright (c) 2026 ${holder}\n\nPermission is hereby granted.\n`
  const withAuthor = { project: { ...project, author } }
  assert.deepEqual(await run({ 'LICENSE.md': license(author) }, withAuthor), [])
  const problems = await run({ 'LICENSE.md': license('ada') }, withAuthor)
  assert.ok(problems.some(problem => /must name the package author/.test(problem)))
})

test('a SITE-LICENSE.md with a different license is allowed', async () => {
  assert.deepEqual(await run({ 'SITE-LICENSE.md': 'Apache License 2.0' }), [])
})

test('a collection site uses the LICENSE.md of its repository', async () => {
  const author = 'Ada Lovelace (ada)'
  const license = `MIT License\n\nCopyright (c) 2026 ${author}\n\nPermission is hereby granted.\n`
  // <repository>/site holds the website; the repository holds the license.
  const site = await fixture({ 'LICENSE.md': null })
  const repository = await mkdtemp(join(tmpdir(), 'package-site-collection-'))
  const root = join(repository, 'site')
  try {
    await cp(site, root, { recursive: true })
    await writeFile(join(repository, 'README.md'), readme)
    const options = { project: { ...project, author, collection: { packagesDir: '../packages' } } }
    const check = () => checkContent({ root, release: true, ...options })
    assert.ok((await check()).some(problem => /Name the license file/.test(problem)))
    await writeFile(join(repository, 'LICENSE.md'), license)
    assert.ok(!(await check()).some(problem => /LICENSE/.test(problem)))
  } finally {
    await rm(site, { recursive: true, force: true })
    await rm(repository, { recursive: true, force: true })
  }
})
