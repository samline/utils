/** True when a DOM is available. Never touch `window` or `document` at import time. */
export const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

/** No-op used as a safe default callback and cleanup. */
export const noop = (): void => {}
