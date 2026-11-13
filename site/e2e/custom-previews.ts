// A package can replace the neutral scenario demos with its own previews
// (site/Demo.astro and site/examples.ts, see .agents/collection-mode.md).
// Scenario-specific tests do not apply then; the package tests its previews
// and copied files itself.
import { existsSync } from 'node:fs'

export const customPreviews = existsSync(new URL('../site/examples.ts', import.meta.url))
export const customPreviewsReason =
  'Custom previews (site/examples.ts) replace the scenario demos; the package tests its own copied files.'
