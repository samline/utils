import { words } from './words.js'

export interface TruncateOptions {
  /** Appended when the text is cut. Defaults to `'…'`. Counts toward `length`. */
  ellipsis?: string
  /** Cut at the last whole word instead of mid-word. Defaults to `true`. */
  wordBoundary?: boolean
}

/**
 * Shorten text to at most `length` characters (code points, so emoji and
 * accents are never split).
 */
export const truncate = (
  input: string,
  length: number,
  { ellipsis = '…', wordBoundary = true }: TruncateOptions = {}
): string => {
  const chars = Array.from(String(input ?? ''))
  if (!Number.isFinite(length) || length < 0 || chars.length <= length) return chars.join('')
  const room = Math.max(0, length - Array.from(ellipsis).length)
  let cut = chars.slice(0, room).join('')
  if (wordBoundary && chars[room] !== undefined && /[\p{L}\p{N}]/u.test(chars[room]!)) {
    const lastSpace = cut.search(/\s\S*$/u)
    if (lastSpace > 0) cut = cut.slice(0, lastSpace)
  }
  return cut.replace(/[\s.,;:!?-]+$/u, '') + ellipsis
}

export interface InitialsOptions {
  /** Maximum number of letters. Defaults to `2`. */
  max?: number
  locale?: string | string[]
}

/** `Samuel Olvera` → `SO`, `ana maría lópez` → `AM` */
export const initials = (input: string, { max = 2, locale }: InitialsOptions = {}): string =>
  words(String(input ?? ''))
    .slice(0, Math.max(0, max))
    .map(word => Array.from(word)[0]!.toLocaleUpperCase(locale))
    .join('')
