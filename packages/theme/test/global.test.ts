import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ThemeGlobal } from '../src/browser/global.js'
import { html, installSystem, reset } from './helpers.js'

type Scope = typeof globalThis & { Theme?: ThemeGlobal }

/** Load the bundle as if from a script tag with `attributes`. */
const load = async (attributes: Record<string, string> = {}) => {
  vi.resetModules()
  const script = document.createElement('script')
  Object.entries(attributes).forEach(([name, value]) => script.setAttribute(name, value))
  vi.spyOn(document, 'currentScript', 'get').mockReturnValue(script)
  await import('../src/browser/global.js')
  return (globalThis as Scope).Theme!
}

beforeEach(() => {
  reset()
  installSystem(false)
})

afterEach(() => {
  ;(globalThis as Scope).Theme?.controller?.destroy()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('applies the stored theme as soon as it loads', async () => {
    localStorage.setItem('theme', 'dark')
    const Theme = await load()
    expect(html.getAttribute('data-theme')).toBe('dark')
    expect(Theme.controller?.mode).toBe('dark')
    Theme.toggle()
    expect(Theme.controller?.theme).toBe('light')
    Theme.set('system')
    expect(localStorage.getItem('theme')).toBe('system')
    expect(Theme.themeScript()).toContain('localStorage')
  })

  it('reads its options from the script tag', async () => {
    localStorage.setItem('scheme', 'sepia')
    await load({
      'data-themes': 'light dark sepia',
      'data-attribute': 'class',
      'data-storage-key': 'scheme',
      'data-default': 'light',
    })
    expect(html.classList.contains('sepia')).toBe(true)

    reset()
    localStorage.setItem('theme', 'dark')
    await load({ 'data-storage-key': 'false' })
    expect(html.getAttribute('data-theme')).toBe('light')
  })

  it('waits for Theme.auto() with data-manual', async () => {
    const Theme = await load({ 'data-manual': '' })
    expect(Theme.controller).toBeNull()
    expect(html.hasAttribute('data-theme')).toBe(false)
    Theme.set('dark')
    Theme.toggle()
    const controller = Theme.auto({ defaultMode: 'dark' })
    expect(Theme.controller).toBe(controller)
    expect(html.getAttribute('data-theme')).toBe('dark')
  })

  it('works without a current script', async () => {
    vi.resetModules()
    vi.spyOn(document, 'currentScript', 'get').mockReturnValue(null)
    await import('../src/browser/global.js')
    expect((globalThis as Scope).Theme!.controller).not.toBeNull()
  })
})
