import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { expect, test } from './fixtures'

const bundle = readFileSync(
  fileURLToPath(new URL('../../packages/theme/dist/browser/theme.global.js', import.meta.url)),
  'utf8'
)

const style = `
  <style>
    :root { --bg: #fff; --fg: #111 }
    [data-theme='dark'] { --bg: #111; --fg: #eee }
    body { background: var(--bg); color: var(--fg); transition: background 2s }
  </style>`

const body = `
  <button id="toggle" data-theme-toggle>Dark mode</button>
  <select id="select" data-theme-select>
    <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
  </select>
`

/** A real page (storage events need an origin) with the bundle in <head>. */
const open = async (page: import('@playwright/test').Page, head = `<script>${bundle}</script>`) => {
  await page.route('http://theme.test/', route =>
    route.fulfill({
      contentType: 'text/html',
      body: `<!doctype html><html><head>${style}${head}<script>window.firstPaint = document.documentElement.getAttribute('data-theme')</script></head><body>${body}</body></html>`,
    })
  )
  await page.goto('http://theme.test/')
}

const background = (page: import('@playwright/test').Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor)

test('the stored theme is applied before the body exists', async ({ page }) => {
  await open(page)
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  expect(await page.evaluate(() => (window as any).firstPaint)).toBe('dark')
  expect(await background(page)).toBe('rgb(17, 17, 17)')
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    'dark'
  )
  await expect(page.locator('#toggle')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('#select')).toHaveValue('dark')
})

test('themeScript alone prevents the flash too', async ({ page }) => {
  await open(page)
  const inline = await page.evaluate(() => (window as any).Theme.themeScript())
  await page.unroute('http://theme.test/')
  await open(page, `<script>${inline}</script>`)
  await page.evaluate(() => localStorage.setItem('theme', 'dark'))
  await page.reload()
  expect(await page.evaluate(() => (window as any).firstPaint)).toBe('dark')
})

test('controls switch at once, without running transitions', async ({ page }) => {
  await open(page)
  await page.locator('#toggle').click()
  // The 2s background transition is skipped.
  expect(await background(page)).toBe('rgb(17, 17, 17)')
  await expect(page.locator('#toggle')).toHaveAttribute('aria-pressed', 'true')
  await page.locator('#select').selectOption('light')
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(
    'light'
  )
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light')
})

test('system mode follows the operating system live', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await open(page)
  expect(await page.evaluate(() => document.documentElement.getAttribute('data-theme'))).toBe(
    'light'
  )
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect
    .poll(() => page.evaluate(() => document.documentElement.getAttribute('data-theme')))
    .toBe('dark')
})

test('a change in one tab reaches the others', async ({ page, context }) => {
  await open(page)
  const other = await context.newPage()
  await open(other)
  await page.locator('#select').selectOption('dark')
  await expect
    .poll(() => other.evaluate(() => document.documentElement.getAttribute('data-theme')))
    .toBe('dark')
  await expect(other.locator('#select')).toHaveValue('dark')
})
