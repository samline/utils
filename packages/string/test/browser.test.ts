import { describe, expect, it } from 'vitest'

describe('browser global', () => {
  it('exposes window.SamlineString', async () => {
    await import('../src/browser/global.js')
    const api = (globalThis as { SamlineString?: Record<string, unknown> }).SamlineString
    expect(typeof api?.slugify).toBe('function')
    expect(typeof api?.camelCase).toBe('function')
  })
})
