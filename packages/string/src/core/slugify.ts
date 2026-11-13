import { removeAccents } from './accents.js'

export interface SlugifyOptions {
  /** Word separator. Defaults to `'-'`. */
  separator?: string
  /** Lower-case the result. Defaults to `true`. */
  lower?: boolean
  /**
   * Replacements applied before anything else, for example
   * `{ '&': 'y', '%': 'por ciento' }`. Keys are matched literally.
   */
  replacements?: Readonly<Record<string, string>>
  /** Maximum length; cuts at a separator when possible. */
  maxLength?: number
  /**
   * Remove leading and trailing separators. Defaults to `true`. Use `false`
   * while the user is typing, so a trailing space can become a separator.
   */
  trim?: boolean
  /** Locale for lower-casing. */
  locale?: string | string[]
}

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * `¡Hola, Ñandú & Café!` → `hola-nandu-cafe`
 *
 * Removes accents, transliterates common letters (ß, æ, ø, œ, ł…), keeps
 * only ASCII letters and digits, and collapses everything else into one
 * separator.
 */
export const slugify = (
  input: string,
  {
    separator = '-',
    lower = true,
    replacements = {},
    maxLength,
    trim = true,
    locale,
  }: SlugifyOptions = {}
): string => {
  let value = String(input ?? '')
  for (const [from, to] of Object.entries(replacements)) value = value.split(from).join(` ${to} `)
  // Lower-case first: some locales produce letters (Turkish ı) that removeAccents transliterates.
  if (lower) value = value.toLocaleLowerCase(locale)
  value = removeAccents(value)

  const sep = escape(separator)
  value = value.replace(/[^A-Za-z0-9]+/g, separator)
  if (separator) value = value.replace(new RegExp(`(?:${sep}){2,}`, 'g'), separator)
  if (trim && separator) value = value.replace(new RegExp(`^(?:${sep})+|(?:${sep})+$`, 'g'), '')
  else if (separator) value = value.replace(new RegExp(`^(?:${sep})+`), '')

  if (
    maxLength !== undefined &&
    Number.isFinite(maxLength) &&
    maxLength >= 0 &&
    value.length > maxLength
  ) {
    const cut = value.slice(0, maxLength)
    const boundary = separator ? cut.lastIndexOf(separator) : -1
    value = boundary > 0 && value[maxLength] !== separator ? cut.slice(0, boundary) : cut
    if (separator) value = value.replace(new RegExp(`(?:${sep})+$`), '')
  }
  return value
}
