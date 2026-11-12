import { test as base, type Page } from '@playwright/test'
import { fileURLToPath } from 'node:url'

const bundle = (pkg: string, file: string) =>
  fileURLToPath(new URL(`../../packages/${pkg}/dist/browser/${file}`, import.meta.url))

/** A blank page with the given packages' browser bundles loaded. */
export const test = base.extend<{ load: (html: string, ...pkgs: string[]) => Promise<Page> }>({
  load: async ({ page }, use) => {
    await use(async (html, ...pkgs) => {
      await page.setContent(`<!doctype html><html><body style="margin:0">${html}</body></html>`)
      for (const pkg of pkgs) await page.addScriptTag({ path: bundle(pkg, `${pkg}.global.js`) })
      return page
    })
  },
})

export { expect } from '@playwright/test'
