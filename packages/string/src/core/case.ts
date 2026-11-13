import { words } from './words.js'

export interface CaseOptions {
  /** Locale for upper/lower casing, for example `'tr'` for Turkish dotted i. */
  locale?: string | string[]
}

const lower = (value: string, locale?: string | string[]) => value.toLocaleLowerCase(locale)
const upper = (value: string, locale?: string | string[]) => value.toLocaleUpperCase(locale)
const upperFirst = (value: string, locale?: string | string[]) => {
  const [first = '', ...rest] = Array.from(value)
  return upper(first, locale) + rest.join('')
}
const titleWord = (value: string, locale?: string | string[]) =>
  upperFirst(lower(value, locale), locale)

/** `hello world` → `helloWorld` */
export const camelCase = (input: string, { locale }: CaseOptions = {}): string =>
  words(input)
    .map((word, index) => (index === 0 ? lower(word, locale) : titleWord(word, locale)))
    .join('')

/** `hello world` → `HelloWorld` */
export const pascalCase = (input: string, { locale }: CaseOptions = {}): string =>
  words(input)
    .map(word => titleWord(word, locale))
    .join('')

const joinLower =
  (separator: string) =>
  (input: string, { locale }: CaseOptions = {}) =>
    words(input)
      .map(word => lower(word, locale))
      .join(separator)

/** `Hello World` → `hello-world` */
export const kebabCase = joinLower('-')
/** `Hello World` → `hello_world` */
export const snakeCase = joinLower('_')
/** `Hello World` → `hello.world` */
export const dotCase = joinLower('.')

/** `Hello World` → `HELLO_WORLD` */
export const constantCase = (input: string, { locale }: CaseOptions = {}): string =>
  words(input)
    .map(word => upper(word, locale))
    .join('_')

export interface TitleCaseOptions extends CaseOptions {
  /**
   * Words kept in lower case unless they come first, for example
   * `['de', 'la', 'y']` or `['of', 'the', 'and']`. Defaults to none.
   */
  smallWords?: readonly string[]
}

/**
 * `the lord of the rings` → `The Lord Of The Rings` (or `The Lord of the Rings`
 * with `smallWords`). Keeps the original spacing and punctuation.
 */
export const titleCase = (
  input: string,
  { locale, smallWords = [] }: TitleCaseOptions = {}
): string => {
  const small = new Set(smallWords.map(word => lower(word, locale)))
  let index = 0
  return String(input ?? '').replace(/[\p{L}\p{N}]+/gu, word => {
    const first = index++ === 0
    const lowered = lower(word, locale)
    return !first && small.has(lowered) ? lowered : upperFirst(lowered, locale)
  })
}

/** `HELLO world. NEW sentence` → `Hello world. new sentence`; only the first letter is upper case. */
export const sentenceCase = (input: string, { locale }: CaseOptions = {}): string =>
  upperFirst(lower(String(input ?? ''), locale), locale)

/** Upper-case the first letter and leave the rest untouched: `hello World` → `Hello World`. */
export const capitalize = (input: string, { locale }: CaseOptions = {}): string =>
  upperFirst(String(input ?? ''), locale)

/** Lower-case the first letter and leave the rest untouched: `Hello` → `hello`. */
export const uncapitalize = (input: string, { locale }: CaseOptions = {}): string => {
  const [first = '', ...rest] = Array.from(String(input ?? ''))
  return lower(first, locale) + rest.join('')
}
