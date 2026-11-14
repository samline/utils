import { test, expect } from '@playwright/test'
import { collection, docs, docsPage, examples, home, target } from './routes'
// Package pages use the package npm name (in a collection, the package's own).
const npmName = target.npmName

test('document/social titles and footer identity use the shared convention', async ({ page }) => {
  for (const path of [home, examples, docs, docsPage('getting-started/')]) {
    await page.goto(path)
    const title = await page.title()
    // A collection package's docs overview is titled by the package itself.
    if (path === docs)
      expect(title).toBe(`${collection ? target.name : 'Documentation'} — ${npmName}`)
    if (path === examples) expect(title).toBe(`Examples — ${npmName}`)
    expect(title.endsWith(` — ${npmName}`), path).toBe(true)
    expect(title.slice(0, -` — ${npmName}`.length).trim()).not.toBe('')
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', title)
    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute('content', npmName)
    if (path === home || path === examples) {
      const footer = page.locator('footer')
      await expect(footer.locator('.footer-bottom p')).toHaveText(
        /©\s+\d{4}\s+samline · Made for the open web\./
      )
      const nav = footer.getByRole('navigation', { name: 'Footer navigation' })
      for (const name of ['Docs', 'Installation guide', 'Working examples', 'Changelog'])
        await expect(nav.getByRole('link', { name, exact: true })).toBeVisible()
      await expect(nav.getByRole('link', { name: /^npm(?: |$)/ })).toBeVisible()
      await expect(nav.getByRole('link', { name: /skill for AI agents/ })).toBeVisible()
    }
  }
})
