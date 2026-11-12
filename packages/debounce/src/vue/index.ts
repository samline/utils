import { getCurrentScope, onScopeDispose, ref, watch, type Ref } from 'vue'

import { debounce, type DebounceOptions, type DebouncedFunction } from '../core/debounce.js'
import { throttle, type ThrottleOptions, type ThrottledFunction } from '../core/throttle.js'

export * from '../core/index.js'

type AnyFunction = (...args: any[]) => any

const cancelOnDispose = (controlled: { cancel: () => void }) => {
  if (getCurrentScope()) onScopeDispose(() => controlled.cancel())
}

/** A debounced callback whose pending call is cancelled when the scope is disposed. */
export const useDebouncedCallback = <F extends AnyFunction>(
  callback: F,
  wait: number,
  options?: DebounceOptions
): DebouncedFunction<F> => {
  const debounced = debounce(callback, wait, options)
  cancelOnDispose(debounced)
  return debounced
}

/** A throttled callback whose pending call is cancelled when the scope is disposed. */
export const useThrottledCallback = <F extends AnyFunction>(
  callback: F,
  wait: number,
  options?: ThrottleOptions
): ThrottledFunction<F> => {
  const throttled = throttle(callback, wait, options)
  cancelOnDispose(throttled)
  return throttled
}

/** A ref that follows `source` once it has stopped changing for `wait` ms. */
export const useDebouncedRef = <T>(source: Ref<T>, wait: number): Ref<T> => {
  const debounced = ref(source.value) as Ref<T>
  const update = debounce((value: T) => {
    debounced.value = value
  }, wait)

  watch(source, value => update(value), { flush: 'post' })
  cancelOnDispose(update)

  return debounced
}
