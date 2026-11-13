import { expect, test } from './fixtures'

const layout = `
  <p id="top"><span data-counter="250">250</span></p>
  <div style="height:150vh"></div>
  <p id="stats" lang="de">
    <span id="de" data-counter="12345.5" data-counter-duration="600">12.345,5</span>
    <span id="text" data-counter data-counter-duration="600">1.200</span>
  </p>
  <span id="repeat" data-counter="40" data-counter-repeat data-counter-duration="300">40</span>
  <div style="height:150vh"></div>
`

test('counters wait at the start value and count to the localized final value', async ({
  load,
  page,
}) => {
  await load(layout, 'counter')
  // In view on load: counts right away.
  await expect(page.locator('#top span')).toHaveText('250')
  await expect(page.locator('#top span')).toHaveAttribute('data-counter-state', 'done')

  // Below the fold: waiting at zero, formatted for the language.
  await expect(page.locator('#de')).toHaveText('0,0')
  await expect(page.locator('#de')).toHaveAttribute('data-counter-state', 'pending')

  await page.locator('#stats').scrollIntoViewIfNeeded()
  await expect(page.locator('#de')).toHaveAttribute('data-counter-state', 'counting')
  await expect(page.locator('#de')).toHaveText('12.345,5')
  // The final value read from German text: 1.200 is one thousand two hundred.
  await expect(page.locator('#text')).toHaveText('1.200')
})

test('values only grow while counting up', async ({ load, page }) => {
  await load(layout, 'counter')
  await page.evaluate(() => {
    const seen: number[] = []
    Object.assign(window, { seen })
    const node = document.getElementById('de')!
    new MutationObserver(() =>
      seen.push(Number(node.textContent!.replace(/\./g, '').replace(',', '.')))
    ).observe(node, { childList: true, characterData: true, subtree: true })
  })
  await page.locator('#stats').scrollIntoViewIfNeeded()
  await expect(page.locator('#de')).toHaveAttribute('data-counter-state', 'done')
  const seen: number[] = await page.evaluate(() => (window as any).seen)
  expect(seen.length).toBeGreaterThan(5)
  expect(seen.every((value, i) => i === 0 || value >= seen[i - 1]!)).toBe(true)
  expect(seen.at(-1)).toBe(12345.5)
})

test('repeat resets on leaving and counts again', async ({ load, page }) => {
  await load(layout, 'counter')
  const repeat = page.locator('#repeat')
  await repeat.scrollIntoViewIfNeeded()
  await expect(repeat).toHaveAttribute('data-counter-state', 'done')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(repeat).toHaveText('0')
  await repeat.scrollIntoViewIfNeeded()
  await expect(repeat).toHaveText('40')
})

test('without the script or with reduced motion, the rendered value stays', async ({
  load,
  page,
}) => {
  await load(layout)
  await expect(page.locator('#de')).toHaveText('12.345,5')

  await page.emulateMedia({ reducedMotion: 'reduce' })
  await load(layout, 'counter')
  await expect(page.locator('#de')).toHaveAttribute('data-counter-state', 'done')
  await expect(page.locator('#de')).toHaveText('12.345,5')
  await expect(page.locator('#text')).toHaveText('1.200')
})
