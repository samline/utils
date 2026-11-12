/**
 * Typed readers for `data-*` options, so every utility can be configured from
 * plain HTML in the same way.
 *
 * Each reader gets the attribute's full name (`data-reveal-delay`) and a
 * fallback. An absent attribute always returns the fallback.
 */

const read = (el: Element, name: string): string | null =>
  el.hasAttribute(name) ? el.getAttribute(name) : null

/** Present-but-empty attributes return the fallback: they are markers, not values. */
export const readString = (el: Element, name: string, fallback: string): string => {
  const raw = read(el, name)
  return raw === null || raw.trim() === '' ? fallback : raw.trim()
}

/**
 * Boolean attributes follow HTML semantics: present, empty, `"true"` or the
 * attribute's own name mean true. `"false"` means false. Anything else returns
 * the fallback.
 */
export const readBoolean = (el: Element, name: string, fallback: boolean): boolean => {
  const raw = read(el, name)
  if (raw === null) return fallback
  const value = raw.trim().toLowerCase()
  if (value === '' || value === 'true' || value === name.toLowerCase()) return true
  if (value === 'false') return false
  return fallback
}

/** Finite numbers only. `NaN`, `Infinity` and empty values return the fallback. */
export const readNumber = (el: Element, name: string, fallback: number): number => {
  const raw = read(el, name)
  if (raw === null || raw.trim() === '') return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

/**
 * `"100"` → `[100, 100]`, `"100 200"` or `"100,200"` → `[100, 200]`.
 * Useful for `[enter, leave]` style options.
 */
export const readNumberPair = (
  el: Element,
  name: string,
  fallback: readonly [number, number]
): [number, number] => {
  const raw = read(el, name)
  if (raw === null) return [fallback[0], fallback[1]]
  const parts = raw
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite)
  if (parts.length === 1) return [parts[0]!, parts[0]!]
  if (parts.length >= 2) return [parts[0]!, parts[1]!]
  return [fallback[0], fallback[1]]
}

/** Returns the value only when it is one of `allowed`. */
export const readEnum = <T extends string>(
  el: Element,
  name: string,
  allowed: readonly T[],
  fallback: T
): T => {
  const raw = read(el, name)?.trim()
  return raw !== undefined && (allowed as readonly string[]).includes(raw) ? (raw as T) : fallback
}
