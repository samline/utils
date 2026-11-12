export interface DebounceOptions {
  /** Invoke on the leading edge of the wait. Defaults to `false`. */
  leading?: boolean
  /** Invoke on the trailing edge of the wait. Defaults to `true`. */
  trailing?: boolean
  /**
   * The longest `fn` may be delayed before it is invoked, even if calls keep
   * coming. Clamped to at least `wait`.
   */
  maxWait?: number
}

type AnyFunction = (...args: any[]) => any

export interface Controlled<F extends AnyFunction> {
  /** Drop the pending invocation, if any. */
  cancel: () => void
  /** Run the pending invocation now and return its result. */
  flush: () => ReturnType<F> | undefined
  /** True while an invocation is scheduled. */
  pending: () => boolean
}

export interface DebouncedFunction<F extends AnyFunction> extends Controlled<F> {
  (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> | undefined
}

/** Non-negative, finite milliseconds. Invalid values become `0`. */
export const toWait = (value: number | undefined): number =>
  typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0

/**
 * Delay `fn` until `wait` ms have passed without another call.
 *
 * Calls forward `this` and their arguments, and return the result of the last
 * invocation. Use `cancel()`, `flush()` and `pending()` to control the
 * schedule (for example `flush()` on submit or `cancel()` on destroy).
 */
export const debounce = <F extends AnyFunction>(
  fn: F,
  wait = 0,
  options: DebounceOptions = {}
): DebouncedFunction<F> => {
  if (typeof fn !== 'function') throw new TypeError('debounce expects a function')

  const delay = toWait(wait)
  const leading = options.leading ?? false
  const trailing = options.trailing ?? true
  const maxing = options.maxWait !== undefined
  const maxWait = maxing ? Math.max(toWait(options.maxWait), delay) : 0

  if (!leading && !trailing) {
    throw new Error('debounce needs `leading` or `trailing` enabled')
  }

  let lastArgs: Parameters<F> | undefined
  let lastThis: ThisParameterType<F> | undefined
  let result: ReturnType<F> | undefined
  let timerId: ReturnType<typeof setTimeout> | undefined
  let lastCallTime: number | undefined
  let lastInvokeTime = 0

  const invoke = (time: number) => {
    const args = lastArgs!
    const thisArg = lastThis
    lastArgs = lastThis = undefined
    lastInvokeTime = time
    result = fn.apply(thisArg, args)
    return result
  }

  const remainingWait = (time: number) => {
    const sinceCall = time - lastCallTime!
    const waiting = delay - sinceCall
    return maxing ? Math.min(waiting, maxWait - (time - lastInvokeTime)) : waiting
  }

  const shouldInvoke = (time: number) => {
    if (lastCallTime === undefined) return true
    const sinceCall = time - lastCallTime
    // A negative gap means the system clock went back: invoke rather than stall.
    return sinceCall >= delay || sinceCall < 0 || (maxing && time - lastInvokeTime >= maxWait)
  }

  const trailingEdge = (time: number) => {
    timerId = undefined
    if (trailing && lastArgs) return invoke(time)
    lastArgs = lastThis = undefined
    return result
  }

  const timerExpired = () => {
    const time = Date.now()
    if (shouldInvoke(time)) {
      trailingEdge(time)
      return
    }
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  const leadingEdge = (time: number) => {
    lastInvokeTime = time
    timerId = setTimeout(timerExpired, delay)
    return leading ? invoke(time) : result
  }

  const debounced = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) return leadingEdge(time)
      if (maxing) {
        clearTimeout(timerId)
        timerId = setTimeout(timerExpired, delay)
        return invoke(time)
      }
    }

    if (timerId === undefined) timerId = setTimeout(timerExpired, delay)
    return result
  } as DebouncedFunction<F>

  debounced.cancel = () => {
    if (timerId !== undefined) clearTimeout(timerId)
    lastInvokeTime = 0
    lastArgs = lastThis = lastCallTime = timerId = undefined
  }

  debounced.flush = () => (timerId === undefined ? result : trailingEdge(Date.now()))

  debounced.pending = () => timerId !== undefined

  return debounced
}

/**
 * @deprecated Use `debounce`. Kept as an alias for 0.x code.
 */
export const createDebounce = debounce
