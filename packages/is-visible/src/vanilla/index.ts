import { observeVisibility, type ElementTarget, type IsVisibleOptions } from '../core/observe.js'

export * from '../core/index.js'

/** Watch `target` and get `visible` / `notVisible` callbacks. Returns a cleanup. */
export function isVisible(target: ElementTarget, options: IsVisibleOptions = {}): () => void {
  return observeVisibility(target, options)
}

export default isVisible
