import { useEffect, useMemo, useRef, useState } from 'react'

import { debounce, type DebounceOptions, type DebouncedFunction } from '../core/debounce.js'
import { throttle, type ThrottleOptions, type ThrottledFunction } from '../core/throttle.js'

export * from '../core/index.js'

type AnyFunction = (...args: any[]) => any

/**
 * A stable debounced callback that always calls the latest `callback`.
 * It is recreated only when `wait` or an option changes, and the pending call
 * is cancelled on unmount.
 */
export const useDebouncedCallback = <F extends AnyFunction>(
  callback: F,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<F> => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const { leading, trailing, maxWait } = options

  const debounced = useMemo(
    () =>
      debounce(((...args: Parameters<F>) => callbackRef.current(...args)) as F, wait, {
        ...(leading !== undefined && { leading }),
        ...(trailing !== undefined && { trailing }),
        ...(maxWait !== undefined && { maxWait }),
      }),
    [wait, leading, trailing, maxWait]
  )

  useEffect(() => () => debounced.cancel(), [debounced])

  return debounced
}

/** Like `useDebouncedCallback`, with throttle semantics. */
export const useThrottledCallback = <F extends AnyFunction>(
  callback: F,
  wait: number,
  options: ThrottleOptions = {}
): ThrottledFunction<F> => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const { leading, trailing } = options

  const throttled = useMemo(
    () =>
      throttle(((...args: Parameters<F>) => callbackRef.current(...args)) as F, wait, {
        ...(leading !== undefined && { leading }),
        ...(trailing !== undefined && { trailing }),
      }),
    [wait, leading, trailing]
  )

  useEffect(() => () => throttled.cancel(), [throttled])

  return throttled
}

/** Returns `value` once it has stopped changing for `wait` ms. */
export const useDebouncedValue = <T>(value: T, wait: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), wait)
    return () => clearTimeout(timerId)
  }, [value, wait])

  return debouncedValue
}
