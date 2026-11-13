import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { CounterGlobal } from '../src/browser/global.js'
import { el, emit, installMock, installMotion, state } from './helpers.js'

const load = async (readyState: DocumentReadyState) => {
  vi.resetModules()
  vi.spyOn(document, 'readyState', 'get').mockReturnValue(readyState)
  await import('../src/browser/global.js')
  return (globalThis as typeof globalThis & { Counter: CounterGlobal }).Counter
}

beforeEach(() => {
  installMock()
  installMotion(false)
})

afterEach(() => {
  ;(globalThis as typeof globalThis & { Counter?: CounterGlobal }).Counter?.controller?.destroy()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('starts on its own once the DOM is ready', async () => {
    const node = el()
    const Counter = await load('loading')
    expect(Counter.controller).toBeNull()

    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(Counter.controller).not.toBeNull()
    expect(state(node)).toBe('pending')
  })

  it('starts right away when the DOM is already ready', async () => {
    const Counter = await load('complete')
    expect(Counter.controller).not.toBeNull()
    expect(Counter.animateNumber).toBeTypeOf('function')
  })

  it('keeps a start made by the page before the DOM is ready', async () => {
    const section = document.body.appendChild(document.createElement('section'))
    const inside = el(undefined, '', section)
    const Counter = await load('loading')

    const controller = Counter.auto({ scope: section, observe: false })
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(Counter.controller).toBe(controller)
    expect(state(inside)).toBe('pending')
  })
})
