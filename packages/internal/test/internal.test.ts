import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  autoInit,
  isBrowser,
  noop,
  onReducedMotionChange,
  prefersReducedMotion,
  readBoolean,
  readEnum,
  readNumber,
  readNumberPair,
  readString,
  resolveElements,
} from '../src/index.js'

const flush = () => new Promise<void>(resolve => setTimeout(resolve, 0))

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('env', () => {
  it('detects the DOM and exposes a no-op', () => {
    expect(isBrowser()).toBe(true)
    expect(noop()).toBeUndefined()
  })

  it('reports no DOM when window is missing', () => {
    vi.stubGlobal('window', undefined)
    expect(isBrowser()).toBe(false)
  })
})

describe('resolveElements', () => {
  it('normalizes every supported target shape', () => {
    document.body.innerHTML = '<p class="a"></p><p class="a"></p><span></span>'
    const [first, second] = Array.from(document.querySelectorAll('.a'))

    expect(resolveElements(first)).toEqual([first])
    expect(resolveElements('.a')).toEqual([first, second])
    expect(resolveElements(document.querySelectorAll('.a'))).toEqual([first, second])
    expect(resolveElements(document.getElementsByClassName('a'))).toEqual([first, second])
    expect(resolveElements([first!, first!, second!])).toEqual([first, second])
    expect(resolveElements({ length: 1, 0: first! })).toEqual([first])
  })

  it('scopes selectors to a root and ignores invalid input', () => {
    document.body.innerHTML = '<div id="r"><i></i></div><i></i>'
    const root = document.getElementById('r')!

    expect(resolveElements('i', root)).toHaveLength(1)
    expect(resolveElements(null)).toEqual([])
    expect(resolveElements(undefined)).toEqual([])
    expect(resolveElements('i', null)).toEqual([])
    expect(resolveElements([{} as Element])).toEqual([])
  })
})

describe('attribute readers', () => {
  const el = document.createElement('div')
  el.setAttribute('data-s', '  hi ')
  el.setAttribute('data-empty', '')
  el.setAttribute('data-t', 'true')
  el.setAttribute('data-f', 'false')
  el.setAttribute('data-x', 'maybe')
  el.setAttribute('data-n', '12.5')
  el.setAttribute('data-nan', 'abc')
  el.setAttribute('data-one', '100')
  el.setAttribute('data-two', '100, 200')
  el.setAttribute('data-bad-pair', 'a b')
  el.setAttribute('data-mode', 'scrub')

  it('reads strings', () => {
    expect(readString(el, 'data-s', 'x')).toBe('hi')
    expect(readString(el, 'data-empty', 'x')).toBe('x')
    expect(readString(el, 'data-missing', 'x')).toBe('x')
  })

  it('reads booleans with HTML semantics', () => {
    expect(readBoolean(el, 'data-empty', false)).toBe(true)
    expect(readBoolean(el, 'data-t', false)).toBe(true)
    expect(readBoolean(el, 'data-f', true)).toBe(false)
    expect(readBoolean(el, 'data-x', true)).toBe(true)
    expect(readBoolean(el, 'data-missing', false)).toBe(false)

    const named = document.createElement('div')
    named.setAttribute('data-once', 'data-once')
    expect(readBoolean(named, 'data-once', false)).toBe(true)
  })

  it('reads finite numbers', () => {
    expect(readNumber(el, 'data-n', 0)).toBe(12.5)
    expect(readNumber(el, 'data-nan', 3)).toBe(3)
    expect(readNumber(el, 'data-empty', 3)).toBe(3)
    expect(readNumber(el, 'data-missing', 3)).toBe(3)
  })

  it('reads number pairs', () => {
    expect(readNumberPair(el, 'data-one', [0, 0])).toEqual([100, 100])
    expect(readNumberPair(el, 'data-two', [0, 0])).toEqual([100, 200])
    expect(readNumberPair(el, 'data-bad-pair', [1, 2])).toEqual([1, 2])
    expect(readNumberPair(el, 'data-missing', [1, 2])).toEqual([1, 2])
  })

  it('reads enums', () => {
    expect(readEnum(el, 'data-mode', ['trigger', 'scrub'] as const, 'trigger')).toBe('scrub')
    expect(readEnum(el, 'data-s', ['trigger', 'scrub'] as const, 'trigger')).toBe('trigger')
    expect(readEnum(el, 'data-missing', ['a'] as const, 'a')).toBe('a')
  })
})

describe('reduced motion', () => {
  it('reads and follows the media query', () => {
    let changeHandler: ((event: MediaQueryListEvent) => void) | undefined
    const removeEventListener = vi.fn()
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: (_: string, handler: (event: MediaQueryListEvent) => void) => {
          changeHandler = handler
        },
        removeEventListener,
      }))
    )

    expect(prefersReducedMotion()).toBe(true)

    const listener = vi.fn()
    const stop = onReducedMotionChange(listener)
    changeHandler?.({ matches: false } as MediaQueryListEvent)
    expect(listener).toHaveBeenCalledWith(false)
    stop()
    expect(removeEventListener).toHaveBeenCalled()
  })

  it('is inert without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(prefersReducedMotion()).toBe(false)
    expect(onReducedMotionChange(vi.fn())).toBe(noop)
  })
})

describe('autoInit', () => {
  it('initializes once, follows DOM changes and cleans up', async () => {
    document.body.innerHTML = '<div data-x></div>'
    const cleanups: Element[] = []
    const init = vi.fn((element: Element) => () => {
      cleanups.push(element)
    })

    const controller = autoInit({ selector: '[data-x]', init })
    expect(init).toHaveBeenCalledTimes(1)

    controller.refresh()
    expect(init).toHaveBeenCalledTimes(1)

    const wrapper = document.createElement('section')
    wrapper.innerHTML = '<span data-x></span>'
    document.body.append(wrapper)
    await flush()
    expect(init).toHaveBeenCalledTimes(2)

    wrapper.remove()
    await flush()
    expect(cleanups).toHaveLength(1)

    controller.destroy()
    expect(cleanups).toHaveLength(2)
  })

  it('keeps elements that are only moved and accepts init without cleanup', async () => {
    document.body.innerHTML = '<div id="a"><p data-y></p></div><div id="b"></div>'
    const cleanup = vi.fn()
    autoInit({ selector: '[data-y]', init: () => cleanup })

    const node = document.querySelector('[data-y]')!
    document.getElementById('b')!.append(node)
    await flush()
    expect(cleanup).not.toHaveBeenCalled()

    const plain = autoInit({ selector: '[data-y]', init: () => undefined, observe: false })
    plain.destroy()
  })

  it('scopes to a root and is inert without a DOM', () => {
    document.body.innerHTML = '<div id="r"><b data-z></b></div><b data-z></b>'
    const init = vi.fn()
    autoInit({ selector: '[data-z]', init, root: document.getElementById('r')!, observe: false })
    expect(init).toHaveBeenCalledTimes(1)

    vi.stubGlobal('window', undefined)
    const inert = autoInit({ selector: '[data-z]', init })
    expect(inert.refresh).toBe(noop)
    expect(inert.destroy).toBe(noop)
  })
})
