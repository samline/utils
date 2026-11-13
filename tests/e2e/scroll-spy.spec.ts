import { expect, test } from './fixtures'

const layout = `
  <style>html { scroll-behavior: smooth; scroll-padding-top: 60px } section { height: 900px } #end { height: 120px }</style>
  <nav data-scroll-spy style="position:fixed;top:0;right:0;background:#fff">
    <a href="#one">One</a> <a href="#two">Two</a> <a href="#three">Three</a> <a href="#end">End</a>
  </nav>
  <div style="height:300px">Intro</div>
  <section id="one">One</section>
  <section id="two">Two</section>
  <section id="three">Three</section>
  <section id="end">End</section>
`

const active = (page: import('@playwright/test').Page) =>
  page.locator('nav [aria-current]').evaluateAll(links => links.map(l => l.textContent))

test('follows the section crossing the line, and the short last one at the bottom', async ({
  load,
  page,
}) => {
  await load(layout, 'scroll-spy')
  await expect.poll(() => active(page)).toEqual([])

  await page.evaluate(() => window.scrollTo({ top: 1300, behavior: 'instant' }))
  await expect.poll(() => active(page)).toEqual(['Two'])

  await page.evaluate(() => window.scrollTo({ top: 1e6, behavior: 'instant' }))
  await expect.poll(() => active(page)).toEqual(['End'])
})

test('a clicked link stays active through the smooth scroll', async ({ load, page }) => {
  await load(layout, 'scroll-spy')
  await page.evaluate(() => {
    const seen: string[] = []
    Object.assign(window, { seen })
    new MutationObserver(() => {
      const link = document.querySelector('nav [aria-current]')
      if (link) seen.push(link.textContent!)
    }).observe(document.querySelector('nav')!, { attributes: true, subtree: true })
  })
  await page.getByRole('link', { name: 'Three' }).click()
  await expect.poll(() => active(page)).toEqual(['Three'])
  await page.waitForFunction(
    () => Math.abs(document.getElementById('three')!.getBoundingClientRect().top - 60) < 2
  )
  await page.waitForTimeout(300)
  expect(await active(page)).toEqual(['Three'])
  // One and Two were passed on the way but never highlighted.
  expect(await page.evaluate(() => (window as any).seen)).toEqual(['Three'])
})

test('works inside a scroll container', async ({ load, page }) => {
  await load(
    `<nav id="toc"><a href="#a">A</a><a href="#b">B</a></nav>
     <div id="box" style="height:300px;overflow:auto">
       <div style="height:500px" id="a">A</div><div style="height:800px" id="b">B</div>
     </div>`,
    'scroll-spy'
  )
  await page.evaluate(() => {
    const box = document.getElementById('box')!
    ;(window as any).ScrollSpy.scrollSpy('#toc', { root: box, offset: 40 })
  })
  await expect.poll(() => page.locator('#toc [aria-current]').textContent()).toBe('A')
  await page.locator('#box').evaluate(box => box.scrollTo(0, 480))
  await expect.poll(() => page.locator('#toc [aria-current]').textContent()).toBe('B')
})
