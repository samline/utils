import { test, expect } from '@playwright/test'
import { customPreviews, customPreviewsReason } from './custom-previews'

test('compact Home initialization links to the actual complete starter files', async ({ page }) => {
  test.skip(customPreviews, customPreviewsReason)
  await page.goto('./')
  const card = page.locator('#how article').last()
  expect(await card.locator('code').textContent()).not.toContain('<!doctype')
  await card.getByRole('link', { name: 'Copy complete working files' }).click()
  // One viewer per loading mode when a CDN is configured; only the active one is visible.
  const viewer = page.locator('[data-code-files]:visible').first()
  await expect(viewer).toBeVisible()
  await viewer.getByRole('tab', { name: 'Complete file', exact: true }).click()
  await expect(viewer.getByRole('tabpanel', { name: 'Complete file', exact: true })).toContainText(
    '<!doctype html>'
  )
})
