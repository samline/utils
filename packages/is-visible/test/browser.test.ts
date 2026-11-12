import { describe, expect, it } from 'vitest'

describe('browser global', () => {
  it('exposes window.isVisible and window.IsVisible', async () => {
    await import('../src/browser/global.js')
    const scope = globalThis as { IsVisible?: Record<string, unknown>; isVisible?: unknown }

    expect(typeof scope.isVisible).toBe('function')
    expect(Object.keys(scope.IsVisible ?? {}).sort()).toEqual(
      ['isVisible', 'observe', 'observeVisibility'].sort()
    )
    expect(scope.IsVisible?.observe).toBe(scope.isVisible)
  })
})
