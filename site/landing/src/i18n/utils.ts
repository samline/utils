import en, { examplesFor, navigationFor } from './translations/en'
import { createI18n, type TranslationShape } from '../../../shared/i18n/createI18n'
import { identityFor, isCollection } from '../../../shared/lib/identity'
import { landingKit, type LandingFactory } from './kit'
export type TranslationDictionary = TranslationShape<typeof en>
export const dictionaries = { en } satisfies Record<string, TranslationDictionary>
const base = createI18n(dictionaries, 'en')
export const getLocale = base.getLocale

// Collection mode: each package owns its Home copy in
// <packagesDir>/<package>/site/landing.ts (see .agents/collection-mode.md).
const packageSections = import.meta.glob<LandingFactory>('@collection/*/site/landing.ts', {
  eager: true,
  import: 'default',
})

const sectionsFor = (slug: string, identity: ReturnType<typeof identityFor>) => {
  const key = Object.keys(packageSections).find(path => path.endsWith(`/${slug}/site/landing.ts`))
  if (!key) throw new Error(`Collection package "${slug}" needs site/landing.ts`)
  const sections = packageSections[key]!({ identity, ...landingKit })
  assertSameShape(en.sections, sections, `${slug}/site/landing.ts`)
  return sections as TranslationDictionary['sections']
}

/** A package's copy must provide every key the shared sections read. */
function assertSameShape(reference: unknown, value: unknown, path: string): void {
  if (Array.isArray(reference)) {
    if (!Array.isArray(value)) throw new Error(`${path} must be an array`)
    return
  }
  if (reference && typeof reference === 'object') {
    if (!value || typeof value !== 'object') throw new Error(`${path} must be an object`)
    for (const key of Object.keys(reference))
      assertSameShape(
        (reference as Record<string, unknown>)[key],
        (value as Record<string, unknown>)[key],
        `${path}.${key}`
      )
    return
  }
  if (typeof reference === 'string' && typeof value !== 'string')
    throw new Error(`${path} must be text`)
}

// Package copy is validated against the site copy's shape (assertSameShape),
// so pages keep the site dictionary's precise literal types.
type Dictionary = typeof en
const cache = new Map<string, Dictionary>()

type AstroLike = { currentLocale?: string; params?: Record<string, string | undefined> }

/** Site copy, or a collection package's copy on pages under /<package>/. */
export const getI18n = (astro: AstroLike = {}): Dictionary => {
  const dictionary = base.getI18n(astro) as Dictionary
  const slug = isCollection ? astro.params?.package : undefined
  if (!slug) return dictionary
  if (!cache.has(slug)) {
    const identity = identityFor(astro)
    cache.set(slug, {
      ...dictionary,
      sections: sectionsFor(slug, identity),
      navigation: {
        ...navigationFor(identity),
        // A package without examples has no Examples page to list.
        items: navigationFor(identity).items.filter(
          item => !('page' in item) || ('hasExamples' in identity && identity.hasExamples)
        ),
      },
      examples: {
        ...examplesFor(identity),
        accessibility:
          'Each preview runs the real package; the copied files load its published browser bundle.',
      },
      controls: {
        ...dictionary.controls,
        copy: { ...dictionary.controls.copy, command: `npm install ${identity.npmName}` },
      },
    } as unknown as Dictionary)
  }
  return cache.get(slug)!
}
