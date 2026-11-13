import { fileURLToPath } from 'node:url'

import { expect, test } from './fixtures'

const css = fileURLToPath(new URL('../../packages/reveal/dist/style.css', import.meta.url))

const layout = `
  <div id="top" data-reveal style="height:200px">Top</div>
  <div style="height:150vh"></div>
  <ul id="list" data-reveal-stagger="120" style="margin:0;padding:0">
    <li data-reveal style="height:80px">1</li>
    <li data-reveal style="height:80px">2</li>
    <li data-reveal style="height:80px">3</li>
  </ul>
  <div id="repeat" data-reveal="left" data-reveal-repeat style="height:200px">Repeat</div>
  <div style="height:150vh"></div>
`

const opacity = (page: import('@playwright/test').Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate(el => getComputedStyle(el).opacity)

test('content in view on load is never hidden; content below the fold reveals on entry', async ({
  load,
  page,
}) => {
  await load(layout)
  // Record every element that is ever hidden while it is inside the viewport.
  await page.evaluate(() => {
    const flashes: string[] = []
    Object.assign(window, { flashes })
    new MutationObserver(records => {
      for (const { target } of records) {
        const el = target as HTMLElement
        if (el.getAttribute?.('data-reveal-state') !== 'pending') continue
        const box = el.getBoundingClientRect()
        if (box.top < innerHeight && box.bottom > 0) flashes.push(el.textContent ?? '')
      }
    }).observe(document, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-reveal-state'],
    })
  })
  await page.addStyleTag({ path: css })
  await page.addScriptTag({
    path: fileURLToPath(
      new URL('../../packages/reveal/dist/browser/reveal.global.js', import.meta.url)
    ),
  })

  await expect(page.locator('#top')).toHaveAttribute('data-reveal-state', 'revealed')
  await expect(page.locator('#list li').first()).toHaveAttribute('data-reveal-state', 'pending')
  expect(await opacity(page, '#list li')).toBe('0')

  await page.locator('#list').scrollIntoViewIfNeeded()
  await expect(page.locator('#list li').first()).not.toHaveAttribute('data-reveal-state', 'pending')
  await expect.poll(() => opacity(page, '#list li:nth-child(3)')).toBe('1')
  await expect(page.locator('#list li').nth(2)).toHaveAttribute('data-reveal-state', 'revealed')

  expect(await page.evaluate(() => (window as any).flashes)).toEqual([])
})

test('items entering together cascade in document order', async ({ load, page }) => {
  await load(layout, 'reveal')
  await page.addStyleTag({ path: css })
  await page.locator('#list').scrollIntoViewIfNeeded()
  await expect(page.locator('#list li').nth(2)).not.toHaveAttribute('data-reveal-state', 'pending')

  const delays = await page
    .locator('#list li')
    .evaluateAll(items =>
      items.map(item => getComputedStyle(item).getPropertyValue('--reveal-delay').trim())
    )
  expect(delays).toEqual(['', '120ms', '240ms'])
})

test('repeat hides on leaving and reveals again on return', async ({ load, page }) => {
  await load(layout, 'reveal')
  await page.addStyleTag({ path: css })
  const repeat = page.locator('#repeat')

  await repeat.scrollIntoViewIfNeeded()
  await expect.poll(() => opacity(page, '#repeat')).toBe('1')

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(repeat).toHaveAttribute('data-reveal-state', 'pending')
  // `left` starts shifted to the right by the default distance.
  expect(await repeat.evaluate(el => getComputedStyle(el).translate)).toMatch(/^12px/)

  await repeat.scrollIntoViewIfNeeded()
  await expect.poll(() => opacity(page, '#repeat')).toBe('1')
})

test('reduced motion keeps everything visible', async ({ load, page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await load(layout, 'reveal')
  await page.addStyleTag({ path: css })
  await expect(page.locator('#list li').first()).toHaveAttribute('data-reveal-state', 'revealed')
  expect(await opacity(page, '#list li')).toBe('1')
})

test('without the script, or when printing, content is visible', async ({ load, page }) => {
  await load(layout)
  await page.addStyleTag({ path: css })
  expect(await opacity(page, '#list li')).toBe('1')

  await page.evaluate(() =>
    document
      .querySelectorAll('[data-reveal]')
      .forEach(el => el.setAttribute('data-reveal-state', 'pending'))
  )
  expect(await opacity(page, '#list li')).toBe('0')
  await page.emulateMedia({ media: 'print' })
  expect(await opacity(page, '#list li')).toBe('1')
})

test('scrub mode follows the scroll position with CSS only', async ({ load, page }) => {
  await load(
    `<div style="height:100vh"></div>
     <div id="scrub" data-reveal="fade" data-reveal-scrub style="height:200px">Scrub</div>
     <div style="height:150vh"></div>`,
    'reveal'
  )
  await page.addStyleTag({ path: css })
  const supported = await page.evaluate(() => CSS.supports('animation-timeline: view()'))
  const scrub = page.locator('#scrub')
  expect(await scrub.getAttribute('data-reveal-state')).toBeNull()

  // Half-way through its entry, it is part-way visible.
  await page.evaluate(() => {
    const el = document.getElementById('scrub')!
    window.scrollTo(0, el.offsetTop - innerHeight + 100)
  })
  // Read after the next frames, once the scroll timeline has updated.
  const read = async () => {
    await page.evaluate(
      () => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
    )
    return Number(await opacity(page, '#scrub'))
  }
  if (supported) {
    await expect.poll(read).toBeGreaterThan(0.2)
    expect(await read()).toBeLessThan(0.8)
  } else {
    expect(await read()).toBe(1)
  }

  await scrub.scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollBy(0, 200))
  await expect.poll(async () => Number(await opacity(page, '#scrub'))).toBe(1)
})
