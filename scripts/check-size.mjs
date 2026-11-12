#!/usr/bin/env node
/**
 * Size budgets for every published entry point.
 *
 * Each entry is bundled the way a consumer's bundler would see it (minified,
 * framework packages external) and gzipped. Budgets live in each package's
 * `package.json` under `"size": { "<entry file>": <max gzip bytes> }`.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'
import { build } from 'esbuild'

const root = new URL('..', import.meta.url).pathname
const packagesDir = join(root, 'packages')
const external = ['react', 'react-dom', 'vue', 'svelte', 'svelte/store']

let failed = false
const rows = []

for (const name of readdirSync(packagesDir)) {
  const dir = join(packagesDir, name)
  const manifestPath = join(dir, 'package.json')
  if (!existsSync(manifestPath)) continue
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  if (manifest.private || !manifest.size) continue

  for (const [file, budget] of Object.entries(manifest.size)) {
    const entry = join(dir, file)
    if (!existsSync(entry)) {
      console.error(`✗ ${manifest.name}: ${file} does not exist (run the build first)`)
      failed = true
      continue
    }
    const result = await build({
      entryPoints: [entry],
      bundle: true,
      minify: true,
      write: false,
      format: 'esm',
      platform: 'browser',
      external,
      logLevel: 'silent',
    })
    const code = result.outputFiles[0].contents
    const gzip = gzipSync(code, { level: 9 }).length
    const ok = gzip <= budget
    if (!ok) failed = true
    rows.push({
      package: manifest.name,
      entry: file.replace(/^\.\/dist\//, ''),
      min: code.length,
      gzip,
      budget,
      status: ok ? 'ok' : 'OVER',
    })
  }
}

console.table(rows)
if (failed) {
  console.error('Size budget exceeded or entry missing.')
  process.exit(1)
}
