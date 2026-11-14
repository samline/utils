// A package can replace the neutral scenario demos with its own previews
// (site/Demo.astro and site/examples.ts, see .agents/collection-mode.md).
// Scenario-specific tests do not apply then; the package tests its previews
// and copied files itself. A collection never shows the scenarios: every
// package brings its own previews and tests its copied files.
import { existsSync } from 'node:fs'
import { collection } from './routes'

export const customPreviews =
  collection || existsSync(new URL('../site/examples.ts', import.meta.url))
export const customPreviewsReason = collection
  ? 'Collection mode: each package shows its own previews and tests its copied files.'
  : 'Custom previews (site/examples.ts) replace the scenario demos; the package tests its own copied files.'
