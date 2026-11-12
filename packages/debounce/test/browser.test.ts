import { describe, expect, it } from 'vitest'

describe('browser global', () => {
  it('exposes window.Debounce', async () => {
    await import('../src/browser/global.js')
    const api = (globalThis as { Debounce?: Record<string, unknown> }).Debounce

    expect(Object.keys(api ?? {}).sort()).toEqual(
      ['createDebounce', 'debounce', 'rafThrottle', 'throttle'].sort()
    )
  })
})
