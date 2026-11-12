import { isBrowser } from './env.js'

/** Anything a utility accepts as its target. */
export type ElementTarget =
  Element | string | Iterable<Element> | ArrayLike<Element> | null | undefined

const isElement = (value: unknown): value is Element =>
  typeof Element !== 'undefined' && value instanceof Element

/**
 * Normalize a target into a de-duplicated array of elements.
 *
 * - `Element` → `[element]`
 * - CSS selector → every match inside `root` (defaults to `document`)
 * - `NodeList`, `HTMLCollection`, arrays and other iterables → their elements
 * - `null`, `undefined`, unknown values, or no DOM → `[]`
 */
export const resolveElements = (
  target: ElementTarget,
  root: ParentNode | null = isBrowser() ? document : null
): Element[] => {
  if (target == null) return []
  if (isElement(target)) return [target]

  if (typeof target === 'string') {
    if (!root) return []
    return Array.from(root.querySelectorAll(target))
  }

  const source =
    typeof (target as Iterable<Element>)[Symbol.iterator] === 'function'
      ? Array.from(target as Iterable<Element>)
      : Array.from(target as ArrayLike<Element>)

  return Array.from(new Set(source.filter(isElement)))
}
