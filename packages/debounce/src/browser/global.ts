import { createDebounce, debounce, rafThrottle, throttle } from '../core/index.js'

const api = { debounce, throttle, rafThrottle, createDebounce }

export type DebounceGlobal = typeof api

;(globalThis as typeof globalThis & { Debounce?: DebounceGlobal }).Debounce = api

export { createDebounce, debounce, rafThrottle, throttle }
