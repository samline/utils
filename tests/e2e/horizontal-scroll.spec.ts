import { expect, test } from './fixtures'

const layout = (attributes = '') => `
  <style>
    [data-horizontal-scroll] { overflow-x: auto }
    [data-horizontal-scroll-track] { display: flex; gap: 0; height: 400px }
    .card { flex: 0 0 600px; height: 400px; display: grid; place-items: center }
  </style>
  <div id="before" style="height:500px">Before</div>
  <section id="pin" data-horizontal-scroll ${attributes}>
    <div data-horizontal-scroll-track>
      ${Array.from({ length: 6 }, (_, i) => `<a class="card" href="#" tabindex="0" id="c${i + 1}">Card ${i + 1}</a>`).join('')}
    </div>
  </section>
  <div id="after" style="height:1500px">After</div>
`

type Page = import('@playwright/test').Page

const scroll = (page: Page, top: number) =>
  page.evaluate(
    y =>
      new Promise(resolve => {
        window.scrollTo({ top: y, behavior: 'instant' })
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      }),
    top
  )

const read = (page: Page) =>
  page.evaluate(() => {
    const section = document.getElementById('pin')!
    const track = section.querySelector<HTMLElement>('[data-horizontal-scroll-track]')!
    return {
      height: section.offsetHeight,
      distance: track.scrollWidth - track.clientWidth,
      trackTop: Math.round(track.getBoundingClientRect().top),
      x: Math.round(
        new DOMMatrix(getComputedStyle(track).transform).m41 ||
          parseFloat(track.style.translate) ||
          0
      ),
      pageWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
    }
  })

test('pins the track and moves it sideways with the page scroll', async ({ load, page }) => {
  await page.setViewportSize({ width: 1000, height: 700 })
  await load(layout(), 'horizontal-scroll')
  await expect(page.locator('#pin')).toHaveAttribute('data-horizontal-scroll-state', 'active')

  const start = await read(page)
  // 6 × 600px cards in a 1000px viewport: 2600px of travel.
  expect(start.distance).toBe(2600)
  expect(start.height).toBe(400 + 2600)
  // Clipped: no horizontal page scroll.
  expect(start.pageWidth).toBe(start.viewport)

  await scroll(page, 500 + 1300)
  const middle = await read(page)
  expect(middle.trackTop).toBe(0)
  expect(middle.x).toBe(-1300)

  await scroll(page, 500 + 2600 + 200)
  const end = await read(page)
  expect(end.x).toBe(-2600)
  expect(end.trackTop).toBeLessThan(0)
})

test('tabbing to a card off to the side scrolls it into view', async ({ load, page }) => {
  await page.setViewportSize({ width: 1000, height: 700 })
  await load(layout(), 'horizontal-scroll')
  await scroll(page, 500)
  await page.locator('#c1').focus()
  for (let i = 0; i < 3; i++) await page.keyboard.press('Tab')
  await expect(page.locator('#c4')).toBeFocused()

  await expect
    .poll(() =>
      page.locator('#c4').evaluate(el => {
        const box = el.getBoundingClientRect()
        return box.left >= 0 && box.right <= innerWidth && box.top >= 0 && box.bottom <= innerHeight
      })
    )
    .toBe(true)
})

test('outside the media query or with reduced motion, the native scroll stays', async ({
  load,
  page,
}) => {
  await page.setViewportSize({ width: 500, height: 700 })
  await load(layout('data-horizontal-scroll-media="(min-width: 768px)"'), 'horizontal-scroll')
  const section = page.locator('#pin')
  await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'inactive')
  expect(await section.evaluate(el => [el.offsetHeight, el.scrollWidth > el.clientWidth])).toEqual([
    expect.any(Number),
    true,
  ])

  await page.setViewportSize({ width: 1000, height: 700 })
  await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'active')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'inactive')
  expect(await section.evaluate(el => el.style.height)).toBe('')
})

test('pins inside a scroll container given as root', async ({ load, page }) => {
  await page.setViewportSize({ width: 1000, height: 700 })
  await load(
    `<div id="box" style="height:400px;overflow:auto;border:1px solid">
      <div style="height:200px">Before</div>
      ${layout()
        .replace(/<div id="before"[^>]*>Before<\/div>/, '')
        .replace(/<div id="after"[^>]*>After<\/div>/, '<div style="height:600px"></div>')}
    </div>`,
    'horizontal-scroll'
  )
  await page.evaluate(() => {
    const global = (window as any).HorizontalScroll
    global.auto({ root: document.getElementById('box') })
  })
  const travel = await page.evaluate(() => {
    const box = document.getElementById('box')!
    const track = box.querySelector<HTMLElement>('[data-horizontal-scroll-track]')!
    return track.scrollWidth - track.clientWidth
  })
  await page.evaluate(
    y =>
      new Promise(resolve => {
        document.getElementById('box')!.scrollTop = y
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      }),
    200 + travel / 2
  )
  const state = await page.evaluate(() => {
    const box = document.getElementById('box')!
    const track = box.querySelector<HTMLElement>('[data-horizontal-scroll-track]')!
    return {
      offset: Math.round(track.getBoundingClientRect().top - box.getBoundingClientRect().top),
      x: Math.round(parseFloat(track.style.translate)),
    }
  })
  expect(state.offset).toBe(1)
  expect(state.x).toBe(-Math.round(travel / 2))
})
