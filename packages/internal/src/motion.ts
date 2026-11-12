import { isBrowser, noop } from './env.js'

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

const getQuery = (): MediaQueryList | null =>
  isBrowser() && typeof window.matchMedia === 'function'
    ? window.matchMedia(REDUCED_MOTION_QUERY)
    : null

/** True when the visitor asked the system to reduce motion. False without a DOM. */
export const prefersReducedMotion = (): boolean => getQuery()?.matches ?? false

/** Call `listener` whenever the preference changes. Returns an unsubscribe function. */
export const onReducedMotionChange = (listener: (reduced: boolean) => void): (() => void) => {
  const query = getQuery()
  if (!query) return noop
  const handler = (event: MediaQueryListEvent) => listener(event.matches)
  query.addEventListener('change', handler)
  return () => query.removeEventListener('change', handler)
}
