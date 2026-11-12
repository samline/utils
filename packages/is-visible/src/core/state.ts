import { observeVisibility, type ElementTarget, type IsVisibleOptions } from './observe.js'

export interface VisibilityStateOptions extends IsVisibleOptions {
  /** Value before the first observation. Defaults to `false`. */
  initialValue?: boolean
}

export interface VisibilityState {
  isVisible: boolean
  entry: IntersectionObserverEntry | null
}

/**
 * Shared engine for the framework adapters: keeps `{ isVisible, entry }` in
 * sync for one element and forwards the user's callbacks with their usual
 * semantics (`notVisible` only with `inOut`).
 */
export const observeState = (
  element: ElementTarget,
  { initialValue = false, inOut = false, visible, notVisible, ...options }: VisibilityStateOptions,
  onState: (state: VisibilityState) => void
): (() => void) => {
  let entry: IntersectionObserverEntry | null = null
  onState({ isVisible: initialValue, entry })

  return observeVisibility(element, {
    ...options,
    // Always track leaving so `isVisible` turns false again; the user's
    // `notVisible` still only runs with `inOut`.
    inOut: true,
    onChange: next => {
      entry = next
    },
    visible: (next, el) => {
      entry = next
      onState({ isVisible: true, entry })
      visible?.(next, el)
    },
    notVisible: (next, el) => {
      entry = next
      onState({ isVisible: false, entry })
      if (inOut) notVisible?.(next, el)
    },
  })
}
