import { expect, test } from './fixtures'

const layout = `
  <div style="height:150vh"></div>
  <div id="a" style="height:200px;background:#ccc">A</div>
  <div id="b" style="height:200px;background:#999">B</div>
  <div style="height:150vh"></div>
`

test('reports entering and leaving the viewport in real layout', async ({ load }) => {
  const page = await load(layout, 'is-visible')

  await page.evaluate(() => {
    const log: string[] = ((window as any).log = [])
    ;(window as any).isVisible('#a', {
      inOut: true,
      visible: () => log.push('in'),
      notVisible: () => log.push('out'),
    })
  })

  // Starts off-screen: no "out" before it was ever visible.
  await page.waitForTimeout(100)
  expect(await page.evaluate(() => (window as any).log)).toEqual([])

  await page.locator('#a').scrollIntoViewIfNeeded()
  await expect.poll(() => page.evaluate(() => (window as any).log)).toEqual(['in'])

  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => page.evaluate(() => (window as any).log)).toEqual(['in', 'out'])
})

test('once, thresholds and shared observers', async ({ load }) => {
  const page = await load(layout, 'is-visible')

  await page.evaluate(() => {
    const w = window as any
    w.hits = { once: 0, half: 0 }
    w.isVisible('#a, #b', { once: true, visible: () => w.hits.once++ })
    w.isVisible('#a', { threshold: 0.9, visible: () => w.hits.half++ })
  })

  // Show only the top 40px of #a: visible at threshold 0, not at 0.9.
  await page.evaluate(() => {
    const a = document.getElementById('a')!
    window.scrollTo(0, a.offsetTop - window.innerHeight + 40)
  })
  await expect.poll(() => page.evaluate(() => (window as any).hits.once)).toBe(1)
  expect(await page.evaluate(() => (window as any).hits.half)).toBe(0)

  await page.locator('#b').scrollIntoViewIfNeeded()
  await expect.poll(() => page.evaluate(() => (window as any).hits)).toEqual({ once: 2, half: 1 })

  // Scrolling back and forth does not repeat `once`.
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.locator('#b').scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  expect(await page.evaluate(() => (window as any).hits.once)).toBe(2)
})
