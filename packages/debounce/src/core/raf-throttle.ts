import type { Controlled } from './debounce.js'

type AnyFunction = (...args: any[]) => any

export interface RafThrottledFunction<F extends AnyFunction> extends Controlled<F> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): void
}

const FRAME_MS = 16

/**
 * Invoke `fn` at most once per animation frame with the latest arguments.
 * Use it for scroll, resize, pointer and ResizeObserver handlers that read or
 * write layout.
 *
 * Falls back to a ~16 ms timer where `requestAnimationFrame` does not exist
 * (SSR, workers, tests), so it never throws.
 */
export const rafThrottle = <F extends AnyFunction>(fn: F): RafThrottledFunction<F> => {
  if (typeof fn !== 'function') throw new TypeError('rafThrottle expects a function')

  let handle: number | ReturnType<typeof setTimeout> | undefined
  let usingRaf = false
  let lastArgs: Parameters<F> | undefined
  let lastThis: ThisParameterType<F> | undefined
  let result: ReturnType<F> | undefined

  const run = () => {
    handle = undefined
    const args = lastArgs
    const thisArg = lastThis
    lastArgs = lastThis = undefined
    if (args) result = fn.apply(thisArg, args)
    return result
  }

  const clear = () => {
    if (handle === undefined) return
    if (usingRaf) cancelAnimationFrame(handle as number)
    else clearTimeout(handle as ReturnType<typeof setTimeout>)
    handle = undefined
  }

  const throttled = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    lastArgs = args
    lastThis = this
    if (handle !== undefined) return
    usingRaf = typeof requestAnimationFrame === 'function'
    handle = usingRaf ? requestAnimationFrame(run) : setTimeout(run, FRAME_MS)
  } as RafThrottledFunction<F>

  throttled.cancel = () => {
    clear()
    lastArgs = lastThis = undefined
  }

  throttled.flush = () => {
    if (handle === undefined) return result
    clear()
    return run()
  }

  throttled.pending = () => handle !== undefined

  return throttled
}
