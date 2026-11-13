import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { HorizontalScrollGlobal } from '../src/browser/global.js'
import { installMedia, installResizeObserver, page } from './helpers.js'

type Scope = typeof globalThis & { HorizontalScroll?: HorizontalScrollGlobal }

const load = async (readyState: DocumentReadyState) => {
  vi.resetModules()
  vi.spyOn(document, 'readyState', 'get').mockReturnValue(readyState)
  await import('../src/browser/global.js')
  return (globalThis as Scope).HorizontalScroll!
}

beforeEach(() => {
  installMedia()
  installResizeObserver()
})

afterEach(() => {
  ;(globalThis as Scope).HorizontalScroll?.controller?.destroy()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('starts on its own once the DOM is ready', async () => {
    const { track } = page()
    const HorizontalScroll = await load('loading')
    expect(HorizontalScroll.controller).toBeNull()

    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(HorizontalScroll.controller).not.toBeNull()
    expect(track.style.position).toBe('sticky')
  })

  it('starts right away when the DOM is already ready', async () => {
    const HorizontalScroll = await load('complete')
    expect(HorizontalScroll.controller).not.toBeNull()
    expect(HorizontalScroll.horizontalScroll).toBeTypeOf('function')
  })

  it('keeps a start made by the page before the DOM is ready', async () => {
    const { section } = page()
    const HorizontalScroll = await load('loading')

    const controller = HorizontalScroll.auto({ speed: 2, observe: false })
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(HorizontalScroll.controller).toBe(controller)
    expect(section.style.height).toBe('1600px')
  })
})
