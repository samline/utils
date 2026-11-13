import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScrollSpyGlobal } from '../src/browser/global.js'
import { current, installMotion, page } from './helpers.js'

type Scope = typeof globalThis & { ScrollSpy?: ScrollSpyGlobal }

const load = async (readyState: DocumentReadyState) => {
  vi.resetModules()
  vi.spyOn(document, 'readyState', 'get').mockReturnValue(readyState)
  await import('../src/browser/global.js')
  return (globalThis as Scope).ScrollSpy!
}

const sections: Array<[string, number]> = [
  ['a', 0],
  ['b', 1200],
]

beforeEach(() => installMotion(false))

afterEach(() => {
  ;(globalThis as Scope).ScrollSpy?.controller?.destroy()
  document.body.innerHTML = ''
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('starts on its own once the DOM is ready', async () => {
    const { nav } = page(sections)
    const ScrollSpy = await load('loading')
    expect(ScrollSpy.controller).toBeNull()

    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(ScrollSpy.controller).not.toBeNull()
    expect(current(nav)).toEqual(['#a'])
  })

  it('starts right away when the DOM is already ready', async () => {
    const ScrollSpy = await load('complete')
    expect(ScrollSpy.controller).not.toBeNull()
    expect(ScrollSpy.scrollSpy).toBeTypeOf('function')
  })

  it('keeps a start made by the page before the DOM is ready', async () => {
    const { nav } = page(sections)
    const ScrollSpy = await load('loading')

    const controller = ScrollSpy.auto({ activeClass: 'on', observe: false })
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(ScrollSpy.controller).toBe(controller)
    expect(nav.querySelector('.on')?.getAttribute('href')).toBe('#a')
  })
})
