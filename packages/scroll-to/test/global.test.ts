import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { ScrollToGlobal } from '../src/browser/global.js'
import { installMotion, page } from './helpers.js'

type Scope = typeof globalThis & { ScrollTo?: ScrollToGlobal }

const load = async (readyState: DocumentReadyState) => {
  vi.resetModules()
  vi.spyOn(document, 'readyState', 'get').mockReturnValue(readyState)
  await import('../src/browser/global.js')
  return (globalThis as Scope).ScrollTo!
}

const click = (element: Element) =>
  element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))

beforeEach(() => installMotion(true))

afterEach(() => {
  ;(globalThis as Scope).ScrollTo?.controller?.destroy()
  document.body.innerHTML = ''
  history.replaceState(null, '', '/')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('browser global', () => {
  it('starts on its own once the DOM is ready', async () => {
    const { state } = page([['install', 1200]])
    document.body.insertAdjacentHTML('beforeend', '<a id="link" href="#install">Install</a>')
    const ScrollTo = await load('loading')
    expect(ScrollTo.controller).toBeNull()

    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(ScrollTo.controller).not.toBeNull()
    click(document.getElementById('link')!)
    expect(state.y).toBe(1200)
  })

  it('starts right away when the DOM is already ready', async () => {
    const ScrollTo = await load('complete')
    expect(ScrollTo.controller).not.toBeNull()
    expect(ScrollTo.scrollTo).toBeTypeOf('function')
    expect(ScrollTo.scrollPosition).toBeTypeOf('function')
    expect(ScrollTo.cancelScroll).toBeTypeOf('function')
  })

  it('keeps a start made by the page before the DOM is ready', async () => {
    const { state } = page([['install', 1200]])
    document.body.insertAdjacentHTML('beforeend', '<a id="link" href="#install">Install</a>')
    const ScrollTo = await load('loading')

    const controller = ScrollTo.auto({ offset: 100 })
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect(ScrollTo.controller).toBe(controller)
    click(document.getElementById('link')!)
    expect(state.y).toBe(1100)
  })
})
