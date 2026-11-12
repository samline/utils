import { debounce, type DebouncedFunction } from './debounce.js'

export interface ThrottleOptions {
  /** Invoke on the first call. Defaults to `true`. */
  leading?: boolean
  /** Invoke once more after the last call in a window. Defaults to `true`. */
  trailing?: boolean
}

type AnyFunction = (...args: any[]) => any

export type ThrottledFunction<F extends AnyFunction> = DebouncedFunction<F>

/**
 * Invoke `fn` at most once every `wait` ms. With the defaults the first call
 * runs immediately and the latest arguments of each window run at its end.
 */
export const throttle = <F extends AnyFunction>(
  fn: F,
  wait = 0,
  { leading = true, trailing = true }: ThrottleOptions = {}
): ThrottledFunction<F> => debounce(fn, wait, { leading, trailing, maxWait: wait })
