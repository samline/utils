// Helpers handed to a collection package's site/landing.ts factory, so its
// copy uses the same rich-text and code shapes as landing/.../en/sections.ts.
import sections from './translations/en/sections'
import type { identityFor } from '../../../shared/lib/identity'
import type { TranslationShape } from '../../../shared/i18n/createI18n'

const text = (value: string) => [{ kind: 'text' as const, value }]
const heading = (prefix: string, accent: string) => [
  { kind: 'text' as const, value: prefix + ' ' },
  { kind: 'emphasis' as const, value: accent },
]
const code = (
  filename: string,
  source: string,
  language: 'html' | 'javascript' | 'bash' | 'css'
) => ({
  filename,
  code: source,
  language,
})

/** `defaults` is the template's starter copy: spread it and override what you need. */
export const landingKit = { text, heading, code, defaults: sections }

export type LandingSections = TranslationShape<typeof sections>

/** Default export of <packagesDir>/<package>/site/landing.ts in collection mode. */
export type LandingFactory = (
  kit: typeof landingKit & { identity: ReturnType<typeof identityFor> }
) => LandingSections
