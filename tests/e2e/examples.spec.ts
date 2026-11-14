// The website shows each example twice: a live preview (site/examples/*.astro)
// and copyable files (site/examples.ts) that load the browser bundle. These
// tests run the copyable files against the built bundle, so the code people
// copy keeps working and does not drift from the previews.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

import counterExamples from '../../packages/counter/site/examples'
import debounceExamples from '../../packages/debounce/site/examples'
import horizontalScrollExamples from '../../packages/horizontal-scroll/site/examples'
import isVisibleExamples from '../../packages/is-visible/site/examples'
import revealExamples from '../../packages/reveal/site/examples'
import scrollSpyExamples from '../../packages/scroll-spy/site/examples'
import scrollToExamples from '../../packages/scroll-to/site/examples'
import stringExamples from '../../packages/string/site/examples'
import themeExamples from '../../packages/theme/site/examples'

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

test.describe('reveal copyable examples', () => {
  // Like the copied index.html: the stylesheet in the head and the bundle,
  // then the example script, at the end of the body while the page parses.
  const openDocument = async (page: import('@playwright/test').Page, example: Example) => {
    const css = readFileSync(
      fileURLToPath(new URL('../../packages/reveal/dist/style.css', import.meta.url)),
      'utf8'
    )
    const script = readFileSync(bundle('reveal'), 'utf8')
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  const scrollBox = (page: import('@playwright/test').Page, top: number) =>
    page.locator('#page').evaluate((box, y) => box.scrollTo(0, y), top)

  test('the grid waits below the fold, then cascades in document order', async ({ page }) => {
    await openDocument(page, find(revealExamples, 'cascade'))
    const items = page.locator('.grid li')
    await expect(items.first()).toHaveAttribute('data-reveal-state', 'pending')

    await scrollBox(page, 10_000)
    await expect(items.last()).toHaveAttribute('data-reveal-state', 'revealed')
    const delays = await items.evaluateAll(list =>
      list.map(item => (item as HTMLElement).style.getPropertyValue('--reveal-delay'))
    )
    expect(delays.slice(0, 3)).toEqual(['', '90ms', '180ms'])
  })

  test('repeat effects hide when scrolled away and play again on return', async ({ page }) => {
    await openDocument(page, find(revealExamples, 'effects'))
    const blur = page.locator('[data-reveal="blur"]')
    await expect(blur).toHaveAttribute('data-reveal-state', 'pending')

    await scrollBox(page, 10_000)
    await expect(blur).toHaveAttribute('data-reveal-state', 'revealed')
    await scrollBox(page, 0)
    await expect(blur).toHaveAttribute('data-reveal-state', 'pending')
    await scrollBox(page, 10_000)
    await expect(blur).not.toHaveAttribute('data-reveal-state', 'pending')
  })

  test('scrub runs on CSS alone and reports support', async ({ page }) => {
    await openDocument(page, find(revealExamples, 'scrub'))
    const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'))
    await expect(page.locator('#support')).toHaveText(supported ? /are supported/ : /stays visible/)
    await expect(page.locator('[data-reveal-scrub]').first()).not.toHaveAttribute(
      'data-reveal-state',
      /.*/
    )
  })
})

test.describe('counter copyable examples', () => {
  // Like the copied index.html: the bundle, then the example script, at the end
  // of the body while the page parses.
  const openDocument = async (page: import('@playwright/test').Page, example: Example) => {
    const script = readFileSync(bundle('counter'), 'utf8')
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  const scrollBox = (page: import('@playwright/test').Page, top: number) =>
    page.locator('#page').evaluate((box, y) => box.scrollTo(0, y), top)

  test('stats wait at zero below the fold and count to the rendered values', async ({ page }) => {
    await openDocument(page, find(counterExamples, 'stats'))
    const numbers = page.locator('[data-counter]')
    await expect(numbers).toHaveText(['0', '0.00', '0'])
    await scrollBox(page, 10_000)
    await expect(numbers).toHaveText(['12,480', '99.95', '42'])
  })

  test('locales and currencies count to the same text they started with', async ({ page }) => {
    await openDocument(page, find(counterExamples, 'locales'))
    const spans = page.locator('.prices span')
    const rendered = ['$1,234.50', '1.234.567,89', '1 234 567', '12,34,567']
    await expect(spans.first()).toHaveAttribute('data-counter-state', 'done', { timeout: 5000 })
    await expect(spans.nth(3)).toHaveAttribute('data-counter-state', 'done')
    // French groups with a narrow no-break space.
    const texts = (await spans.allTextContents()).map(text => text.replace(/\s/g, ' '))
    expect(texts).toEqual(rendered)
  })

  test('repeat counts down again after leaving', async ({ page }) => {
    await openDocument(page, find(counterExamples, 'repeat'))
    const countdown = page.locator('[data-counter-from="10"]')
    await expect(countdown).toHaveText('10')
    await scrollBox(page, 10_000)
    await expect(countdown).toHaveText('0', { timeout: 5000 })
    await scrollBox(page, 0)
    await expect(countdown).toHaveText('10')
  })
})

test.describe('scroll-spy copyable examples', () => {
  const openDocument = async (page: import('@playwright/test').Page, example: Example) => {
    const script = readFileSync(bundle('scroll-spy'), 'utf8')
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  const current = (page: import('@playwright/test').Page) =>
    page.locator('nav [aria-current]').evaluateAll(links => links.map(l => l.textContent))
  /** Put the section's top just below the top of the scrolling box. */
  const reach = (page: import('@playwright/test').Page, box: string, id: string) =>
    page.evaluate(
      ([box, id]) => {
        const root = document.querySelector(box)!
        const top = document.getElementById(id)!.getBoundingClientRect().top
        root.scrollTo({
          top: root.scrollTop + top - root.getBoundingClientRect().top - 10,
          behavior: 'instant',
        })
      },
      [box, id] as const
    )

  test('the table of contents follows the article and holds a clicked link', async ({ page }) => {
    await openDocument(page, find(scrollSpyExamples, 'toc'))
    await expect.poll(() => current(page)).toEqual(['Overview'])
    await reach(page, '#article', 'install')
    await expect.poll(() => current(page)).toEqual(['Install'])
    await page.getByRole('link', { name: 'FAQ' }).click()
    await expect.poll(() => current(page)).toEqual(['FAQ'])
    await page.waitForTimeout(800)
    expect(await current(page)).toEqual(['FAQ'])
  })

  test('the one-page menu sets its class and the hash without history entries', async ({
    page,
  }) => {
    await openDocument(page, find(scrollSpyExamples, 'menu'))
    const length = await page.evaluate(() => history.length)
    await reach(page, '#page', 'work')
    await expect(page.locator('.menu a.is-active')).toHaveText('Work')
    await expect.poll(() => page.evaluate(() => location.hash)).toBe('#work')
    expect(await page.evaluate(() => history.length)).toBe(length)
  })

  test('a long navigation scrolls itself, never the page', async ({ page }) => {
    await openDocument(page, find(scrollSpyExamples, 'long'))
    await page.locator('#book').evaluate(box => box.scrollTo({ top: 1e5, behavior: 'instant' }))
    await expect.poll(() => current(page)).toEqual(['Chapter 12'])
    await expect.poll(() => page.locator('nav').evaluate(nav => nav.scrollTop)).toBeGreaterThan(0)
    await expect(page.locator('nav [aria-current]')).toBeInViewport()
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })
})

test.describe('horizontal-scroll copyable examples', () => {
  type Page = import('@playwright/test').Page
  const openDocument = async (page: Page, example: Example) => {
    const script = readFileSync(bundle('horizontal-scroll'), 'utf8')
    await page.setViewportSize({ width: 1000, height: 700 })
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  /** Scroll the page to `fraction` of the way through the pinned section. */
  const through = (page: Page, fraction: number) =>
    page.evaluate(
      fraction =>
        new Promise<{ x: number; top: number }>(resolve => {
          const section = document.querySelector<HTMLElement>('[data-horizontal-scroll]')!
          const track = section.querySelector<HTMLElement>('[data-horizontal-scroll-track]')!
          const pin = parseFloat(track.style.top) || 0
          const start = section.getBoundingClientRect().top + scrollY - pin
          const length = section.offsetHeight - track.offsetHeight
          window.scrollTo({ top: start + length * fraction, behavior: 'instant' })
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              resolve({
                x: Math.round(parseFloat(track.style.translate) || 0),
                top: Math.round(track.getBoundingClientRect().top),
              })
            )
          )
        }),
      fraction
    )
  const distance = (page: Page) =>
    page
      .locator('[data-horizontal-scroll-track]')
      .evaluate(track => track.scrollWidth - track.clientWidth)

  test('the gallery pins and crosses its row, then lets the page carry on', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'gallery'))
    await expect(page.locator('[data-horizontal-scroll]')).toHaveAttribute(
      'data-horizontal-scroll-state',
      'active'
    )
    const travel = await distance(page)
    expect(travel).toBeGreaterThan(1000)
    expect(await through(page, 0.5)).toEqual({ x: -Math.round(travel / 2), top: 0 })
    expect((await through(page, 1)).x).toBe(-travel)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1000)
  })

  test('the timeline pins under the header and fills its progress bar', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'progress'))
    const state = await through(page, 0.5)
    expect(state.top).toBe(64)
    const progress = () =>
      page
        .locator('.progress')
        .evaluate(bar => Number(getComputedStyle(bar).getPropertyValue('--progress')))
    await expect.poll(progress).toBeCloseTo(0.5, 1)
    await through(page, 1)
    await expect.poll(progress).toBe(1)
  })

  test('the carousel only pins on wide screens', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'responsive'))
    const section = page.locator('[data-horizontal-scroll]')
    await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'active')
    await page.setViewportSize({ width: 600, height: 700 })
    await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'inactive')
    expect(
      await section.evaluate(el => [
        getComputedStyle(el).scrollSnapType,
        el.scrollWidth > el.clientWidth,
      ])
    ).toEqual(['x mandatory', true])
  })
})

test.describe('scroll-to copyable examples', () => {
  type Page = import('@playwright/test').Page
  const openDocument = async (page: Page, example: Example) => {
    const script = readFileSync(bundle('scroll-to'), 'utf8')
    await page.setViewportSize({ width: 1000, height: 700 })
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  const top = (page: Page, selector: string) =>
    page.locator(selector).evaluate(el => Math.round(el.getBoundingClientRect().top))

  test('anchors land below the fixed header and focus their section', async ({ page }) => {
    await openDocument(page, find(scrollToExamples, 'header'))
    const header = await page.locator('#header').evaluate(el => el.offsetHeight)
    await page.getByRole('link', { name: 'Pricing' }).click()
    await expect.poll(() => top(page, '#pricing')).toBe(header)
    await expect(page.locator('#pricing')).toBeFocused()
    await page.getByRole('button', { name: 'Back to top' }).click()
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0)
  })

  test('the selected tab is centered in its strip', async ({ page }) => {
    await openDocument(page, find(scrollToExamples, 'tabs'))
    await page.getByRole('tab', { name: 'Topic 7' }).click()
    await expect(page.getByRole('tab', { name: 'Topic 7' })).toHaveAttribute(
      'aria-selected',
      'true'
    )
    await expect
      .poll(() =>
        page.evaluate(() => {
          const strip = document.getElementById('tabs')!.getBoundingClientRect()
          const tab = document.getElementById('tab-7')!.getBoundingClientRect()
          return Math.abs(tab.left + tab.width / 2 - (strip.left + strip.width / 2)) < 2
        })
      )
      .toBe(true)
  })

  test('the answer is highlighted once the scroll arrives', async ({ page }) => {
    await openDocument(page, find(scrollToExamples, 'await'))
    await page.locator('#show').click()
    await expect(page.locator('#status')).toHaveText('Arrived')
    await expect(page.locator('#q4')).toHaveClass(/flash/)
    expect(await top(page, '#q4')).toBe(16)
  })
})

test.describe('theme copyable examples', () => {
  type Page = import('@playwright/test').Page
  // Like the copied index.html: the bundle in the head, with the example's
  // script tag attributes, then the example script at the end of the body.
  const openDocument = async (
    page: Page,
    example: Example & { cdnScript?: { attributes?: Readonly<Record<string, string>> } }
  ) => {
    const script = readFileSync(bundle('theme'), 'utf8')
    const attributes = Object.entries(example.cdnScript?.attributes ?? {})
      .map(([name, value]) => ` ${name}="${value}"`)
      .join('')
    const body = `<!doctype html><html lang="en"><head><script${attributes}>${script}</script><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${example.files.js}</script></body></html>`
    await page.emulateMedia({ colorScheme: 'light' })
    // A real origin, so the choice is stored like on a site.
    await page.unroute('http://theme.test/')
    await page.route('http://theme.test/', route =>
      route.fulfill({ contentType: 'text/html', body })
    )
    await page.goto('http://theme.test/')
  }
  const html = (page: Page) => page.locator('html')

  test('the toggle switches dark mode and reports it', async ({ page }) => {
    await openDocument(page, find(themeExamples, 'toggle'))
    const toggle = page.getByRole('button', { name: 'Dark mode' })
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
    await expect(toggle).toHaveAttribute('aria-pressed', 'false')
    await toggle.click()
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
    await expect(toggle).toHaveAttribute('aria-pressed', 'true')
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.emulateMedia({ colorScheme: 'light' })
    await expect(html(page)).toHaveAttribute('data-theme', 'dark')
  })

  test('buttons and the select stay in sync and report changes', async ({ page }) => {
    await openDocument(page, find(themeExamples, 'picker'))
    await expect(page.locator('#status')).toHaveText('Following the system: light')
    await page.getByRole('button', { name: 'Dark' }).click()
    await expect(page.locator('select')).toHaveValue('dark')
    await expect(page.locator('#status')).toHaveText('Chosen: dark')
    await page.locator('select').selectOption('system')
    await expect(page.getByRole('button', { name: 'System' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await expect(html(page)).toHaveAttribute('data-theme', 'light')
    await page.emulateMedia({ colorScheme: 'dark' })
    await expect(page.locator('#status')).toHaveText('Following the system: dark')
  })

  test('custom themes are written as a class with a theme color', async ({ page }) => {
    await openDocument(page, find(themeExamples, 'custom'))
    await expect(page.getByLabel('Light')).toBeChecked()
    await page.getByLabel('Sepia').check()
    await expect(html(page)).toHaveClass('sepia')
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#f4ecd8')
    await page.getByLabel('Dark').check()
    await expect(html(page)).toHaveClass('dark')
    await expect(html(page)).toHaveCSS('color-scheme', 'dark')
  })

  test('a stored custom theme is on the page before the example script runs', async ({ page }) => {
    const example = find(themeExamples, 'custom')
    await openDocument(page, example)
    await page.getByLabel('Sepia').check()
    // Reload without the example script: the script tag alone must restore sepia.
    await openDocument(page, { ...example, files: { ...example.files, js: '' } })
    await expect(html(page)).toHaveClass('sepia')
    await expect(page.getByLabel('Sepia')).toBeChecked()
  })
})
