// The website shows each example twice: a live preview (site/examples/*.astro)
// and copyable files (site/examples.ts) that load the browser bundle. These
// tests run the copyable files against the built bundle, so the code people
// copy keeps working and does not drift from the previews.
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

import debounceExamples from '../../packages/debounce/site/examples'
import isVisibleExamples from '../../packages/is-visible/site/examples'
import stringExamples from '../../packages/string/site/examples'

const bundle = (pkg: string) =>
  fileURLToPath(new URL(`../../packages/${pkg}/dist/browser/${pkg}.global.js`, import.meta.url))

type Example = { id: string; files: { html: string; css?: string; js: string } }

const open = async (page: import('@playwright/test').Page, pkg: string, example: Example) => {
  await page.setContent(
    `<!doctype html><html><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main></body></html>`
  )
  await page.addScriptTag({ path: bundle(pkg) })
  await page.addScriptTag({ content: example.files.js })
}

const find = <T extends Example>(list: readonly T[], id: string) =>
  list.find(item => item.id === id)!

test.describe('debounce copyable examples', () => {
  test('search waits for quiet, flushes on Enter and cancels on Escape', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'search'))
    const input = page.locator('#search')
    await input.pressSequentially('pe', { delay: 30 })
    await expect(page.locator('#status')).toHaveText('3 results for “pe”')
    await input.fill('plu')
    await input.press('Enter')
    await expect(page.locator('#status')).toHaveText('1 results for “plu”')
    await input.fill('xyz')
    await input.dispatchEvent('input')
    await input.press('Escape')
    await page.waitForTimeout(400)
    await expect(page.locator('#status')).toHaveText('1 results for “plu”')
  })

  test('autosave saves at once, then at most once per second', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'autosave'))
    await page.locator('#note').pressSequentially('hello there', { delay: 20 })
    await expect(page.locator('#saved')).toHaveText(/^Saved 1 times/)
    await expect(page.locator('#saved')).toHaveText(/^Saved 2 times · 11 characters/, {
      timeout: 2000,
    })
  })

  test('progress follows the scroll position', async ({ page }) => {
    await open(page, 'debounce', find(debounceExamples, 'progress'))
    await page.locator('#article').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('#bar')).toHaveAttribute('aria-valuenow', '100')
  })
})

test.describe('is-visible copyable examples', () => {
  test('reveal marks sections once as they enter', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'reveal'))
    await expect(page.locator('.reveal').first()).toHaveClass(/is-visible/)
    await page.locator('#list').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('.reveal').last()).toHaveClass(/is-visible/)
  })

  test('lazy load fills items before they scroll in', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'lazy'))
    await expect(page.locator('#feed article').first()).toHaveText('Story 1 loaded')
    await expect(page.locator('#feed article').nth(4)).toHaveText('Loading…')
    await page.locator('#feed').evaluate(element => (element.scrollTop = element.scrollHeight))
    await expect(page.locator('#feed article').nth(4)).toHaveText('Story 5 loaded')
  })

  test('pause runs only while the panel is visible', async ({ page }) => {
    await open(page, 'is-visible', find(isVisibleExamples, 'pause'))
    await page.waitForTimeout(400)
    await expect(page.locator('#ticks')).toHaveText('0')
    await page.locator('#panel').scrollIntoViewIfNeeded()
    await expect
      .poll(async () => Number(await page.locator('#ticks').textContent()))
      .toBeGreaterThan(1)
    await page.locator('#box').evaluate(element => (element.scrollTop = 0))
    await page.waitForTimeout(300)
    const paused = Number(await page.locator('#ticks').textContent())
    await page.waitForTimeout(600)
    expect(Number(await page.locator('#ticks').textContent())).toBe(paused)
  })
})

test.describe('string copyable examples', () => {
  test('slug follows the title, then keeps a typed separator and trims on change', async ({
    page,
  }) => {
    await open(page, 'string', find(stringExamples, 'slug'))
    await expect(page.locator('#slug')).toHaveValue('cafe-y-te-guia-2026')
    await page.locator('#slug').fill('')
    await page.locator('#slug').pressSequentially('Mi Página ', { delay: 10 })
    await expect(page.locator('#slug')).toHaveValue('mi-pagina-')
    await page.locator('#slug').blur()
    await expect(page.locator('#slug')).toHaveValue('mi-pagina')
    await page.locator('#title').fill('Otro título')
    await expect(page.locator('#slug')).toHaveValue('mi-pagina')
  })

  test('keys round-trip between snake_case and camelCase', async ({ page }) => {
    await open(page, 'string', find(stringExamples, 'keys'))
    const data = JSON.parse((await page.locator('#output').textContent()) ?? '{}')
    expect(Object.keys(data.forJs)).toEqual(['userId', 'firstName', 'lastLoginAt'])
    expect(Object.keys(data.back)).toEqual(['user_id', 'first_name', 'last_login_at'])
  })

  test('cards build initials and truncated bios', async ({ page }) => {
    await open(page, 'string', find(stringExamples, 'cards'))
    await expect(page.locator('.avatar')).toHaveText(['SO', 'AM'])
    await expect(page.locator('#people li').first()).toContainText('Builds small,')
    await expect(page.locator('#people li').first()).toContainText('…')
  })
})
