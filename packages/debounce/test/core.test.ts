import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createDebounce, debounce, rafThrottle, throttle } from '../src/index.js'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('debounce', () => {
  it('runs once on the trailing edge with the latest arguments', () => {
    const fn = vi.fn((value: string) => value.toUpperCase())
    const debounced = debounce(fn, 50)

    debounced('a')
    debounced('b')
    expect(fn).not.toHaveBeenCalled()
    expect(debounced.pending()).toBe(true)

    vi.advanceTimersByTime(49)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('b')
    expect(debounced.pending()).toBe(false)
    expect(debounced('c')).toBe('B')
  })

  it('restarts the wait on every call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50)

    debounced()
    vi.advanceTimersByTime(40)
    debounced()
    vi.advanceTimersByTime(40)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('forwards this', () => {
    const target = {
      name: 'ctx',
      read: debounce(function (this: { name: string }) {
        return this.name
      }, 10),
    }
    target.read()
    vi.advanceTimersByTime(10)
    expect(target.read()).toBe('ctx')
  })

  it('supports leading only', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50, { leading: true, trailing: false })

    debounced(1)
    debounced(2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith(1)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced(3)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('supports leading and trailing without double-invoking a single call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50, { leading: true })

    debounced(1)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced(2)
    debounced(3)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(3)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  it('honours maxWait during continuous calls', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50, { maxWait: 120 })

    for (let i = 0; i < 10; i++) {
      debounced(i)
      vi.advanceTimersByTime(30)
    }

    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(2)
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenLastCalledWith(9)
  })

  it('clamps maxWait to wait and invalid waits to 0', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100, { maxWait: 10 })
    debounced()
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledTimes(1)

    const zero = vi.fn()
    debounce(zero, Number.NaN)()
    vi.advanceTimersByTime(0)
    expect(zero).toHaveBeenCalledTimes(1)

    const negative = vi.fn()
    debounce(negative, -5)()
    vi.advanceTimersByTime(0)
    expect(negative).toHaveBeenCalledTimes(1)
  })

  it('cancels and flushes', () => {
    const fn = vi.fn((value: number) => value * 2)
    const debounced = debounce(fn, 50)

    debounced(1)
    debounced.cancel()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
    expect(debounced.pending()).toBe(false)

    debounced(2)
    expect(debounced.flush()).toBe(4)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(debounced.flush()).toBe(4)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(1)

    debounced.cancel()
  })

  it('invokes when the clock goes backwards', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 50, { leading: true })
    const now = Date.now()

    debounced()
    vi.setSystemTime(now - 1000)
    debounced()
    expect(fn).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('validates its input', () => {
    expect(() => debounce(undefined as never, 10)).toThrow(TypeError)
    expect(() => debounce(() => {}, 10, { leading: false, trailing: false })).toThrow()
  })

  it('keeps createDebounce as an alias', () => {
    expect(createDebounce).toBe(debounce)
  })
})

describe('throttle', () => {
  it('runs immediately, then at most once per window with the latest arguments', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled(1)
    expect(fn).toHaveBeenCalledTimes(1)
    throttled(2)
    throttled(3)
    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith(3)
  })

  it('keeps a steady rate under continuous calls', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    for (let i = 0; i < 50; i++) {
      throttled(i)
      vi.advanceTimersByTime(10)
    }
    vi.advanceTimersByTime(100)

    expect(fn.mock.calls.length).toBeGreaterThanOrEqual(5)
    expect(fn.mock.calls.length).toBeLessThanOrEqual(7)
    expect(fn).toHaveBeenLastCalledWith(49)
  })

  it('can skip the leading or trailing call', () => {
    const noLeading = vi.fn()
    const a = throttle(noLeading, 100, { leading: false })
    a()
    expect(noLeading).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(noLeading).toHaveBeenCalledTimes(1)

    const noTrailing = vi.fn()
    const b = throttle(noTrailing, 100, { trailing: false })
    b()
    b()
    vi.advanceTimersByTime(100)
    expect(noTrailing).toHaveBeenCalledTimes(1)
  })
})

describe('rafThrottle', () => {
  it('runs once per frame with the latest arguments', () => {
    const frames: FrameRequestCallback[] = []
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => frames.push(cb))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())

    const fn = vi.fn()
    const throttled = rafThrottle(fn)

    throttled(1)
    throttled(2)
    expect(frames).toHaveLength(1)
    expect(throttled.pending()).toBe(true)

    frames[0]!(0)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2)
    expect(throttled.pending()).toBe(false)
  })

  it('cancels and flushes the pending frame', () => {
    const cancel = vi.fn()
    vi.stubGlobal('requestAnimationFrame', () => 7)
    vi.stubGlobal('cancelAnimationFrame', cancel)

    const fn = vi.fn((value: number) => value + 1)
    const throttled = rafThrottle(fn)

    throttled(1)
    throttled.cancel()
    expect(cancel).toHaveBeenCalledWith(7)
    expect(fn).not.toHaveBeenCalled()

    throttled(5)
    expect(throttled.flush()).toBe(6)
    expect(throttled.flush()).toBe(6)
  })

  it('falls back to a timer without requestAnimationFrame and forwards this', () => {
    vi.stubGlobal('requestAnimationFrame', undefined)
    const ctx = {
      value: 3,
      read: rafThrottle(function (this: { value: number }) {
        return this.value
      }),
    }

    ctx.read()
    ctx.read.cancel()
    ctx.read()
    vi.advanceTimersByTime(16)
    expect(ctx.read.flush()).toBe(3)
  })

  it('validates its input', () => {
    expect(() => rafThrottle(null as never)).toThrow(TypeError)
  })
})
