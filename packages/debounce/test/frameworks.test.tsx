import { act, renderHook } from '@testing-library/react'
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'

import * as react from '../src/react/index.js'
import * as svelte from '../src/svelte/index.js'
import * as vue from '../src/vue/index.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('react', () => {
  it('debounces with the latest callback and cancels on unmount', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender, unmount } = renderHook(
      ({ cb }) => react.useDebouncedCallback(cb, 50),
      { initialProps: { cb: first } }
    )
    const stable = result.current

    rerender({ cb: second })
    expect(result.current).toBe(stable)

    act(() => {
      result.current('a')
      vi.advanceTimersByTime(50)
    })
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith('a')

    result.current('b')
    unmount()
    vi.advanceTimersByTime(50)
    expect(second).toHaveBeenCalledTimes(1)
  })

  it('recreates the debounced function when wait or options change', () => {
    const cb = vi.fn()
    const { result, rerender } = renderHook(
      ({ wait, leading }) =>
        react.useDebouncedCallback(cb, wait, { leading, maxWait: 500, trailing: true }),
      { initialProps: { wait: 50, leading: false } }
    )
    const before = result.current
    rerender({ wait: 80, leading: true })
    expect(result.current).not.toBe(before)
  })

  it('throttles callbacks', () => {
    const cb = vi.fn()
    const { result } = renderHook(() =>
      react.useThrottledCallback(cb, 100, { leading: true, trailing: true })
    )
    act(() => {
      result.current(1)
      result.current(2)
    })
    expect(cb).toHaveBeenCalledTimes(1)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(cb).toHaveBeenLastCalledWith(2)

    const plain = renderHook(() => react.useThrottledCallback(cb, 100))
    expect(typeof plain.result.current.cancel).toBe('function')
  })

  it('debounces values', () => {
    const { result, rerender } = renderHook(({ value }) => react.useDebouncedValue(value, 50), {
      initialProps: { value: 'a' },
    })
    rerender({ value: 'b' })
    expect(result.current).toBe('a')
    act(() => {
      vi.advanceTimersByTime(50)
    })
    expect(result.current).toBe('b')
  })
})

describe('vue', () => {
  it('debounces and throttles callbacks and cancels on dispose', () => {
    const cb = vi.fn()
    const scope = effectScope()
    const [debounced, throttled] = scope.run(() => [
      vue.useDebouncedCallback(cb, 50),
      vue.useThrottledCallback(cb, 50),
    ])!

    throttled(1)
    expect(cb).toHaveBeenCalledTimes(1)
    debounced(2)
    scope.stop()
    vi.advanceTimersByTime(50)
    expect(cb).toHaveBeenCalledTimes(1)

    // Outside a scope: still works, nothing to dispose.
    const loose = vue.useDebouncedCallback(cb, 10)
    loose(3)
    vi.advanceTimersByTime(10)
    expect(cb).toHaveBeenLastCalledWith(3)
  })

  it('debounces refs', async () => {
    const source = ref('a')
    const scope = effectScope()
    const debounced = scope.run(() => vue.useDebouncedRef(source, 50))!

    source.value = 'b'
    await nextTick()
    expect(debounced.value).toBe('a')
    vi.advanceTimersByTime(50)
    expect(debounced.value).toBe('b')
    scope.stop()
  })
})

describe('svelte', () => {
  it('debounces set and chained updates', () => {
    const store = svelte.createDebouncedStore(1, 50)

    store.set(2)
    store.update(value => value + 10)
    expect(get(store)).toBe(1)
    vi.advanceTimersByTime(50)
    expect(get(store)).toBe(12)

    store.update(value => value * 2)
    store.flush()
    expect(get(store)).toBe(24)

    store.set(99)
    store.cancel()
    vi.advanceTimersByTime(50)
    expect(get(store)).toBe(24)
  })
})
