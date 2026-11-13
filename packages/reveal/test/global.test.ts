import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { RevealGlobal } from '../src/browser/global.js'
import { el, emit, installMock, installMotion, state } from './helpers.js'

const load = async (readyState: DocumentReadyState) => {
  vi.resetModules()
  vi.spyOn(document, 'readyState', 'get').mockReturnValue(readyState)
  await import('../src/browser/global.js')
  return (globalThis as typeof globalThis & { Reveal: RevealGlobal }).Reveal
}

beforeEach(() => {
  installMock()
  installMotion(false)
})

afterEach(() => {
  ;(globalThis as typeof globalThis & { Reveal?: RevealGlobal }).Reveal?.controller?.destroy()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('starts on its own once the DOM is ready', async () => {
    const node = el()
    const Reveal = await load('loading')
    expect(Reveal.controller).toBeNull()

    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(Reveal.controller).not.toBeNull()
    emit(node, 'below')
    expect(state(node)).toBe('pending')
  })

  it('starts right away when the DOM is already ready', async () => {
    const Reveal = await load('complete')
    expect(Reveal.controller).not.toBeNull()
    expect(Reveal.effects).toContain('blur')
  })

  it('keeps a start made by the page before the DOM is ready', async () => {
    const section = document.body.appendChild(document.createElement('section'))
    const inside = el(undefined, section)
    const Reveal = await load('loading')

    const controller = Reveal.auto({ scope: section, observe: false })
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(Reveal.controller).toBe(controller)
    emit(inside, 'below')
    expect(state(inside)).toBe('pending')
  })
})
