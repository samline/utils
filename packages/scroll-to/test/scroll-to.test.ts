import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import defaultExport, {
  EASINGS,
  autoScrollTo,
  cancelScroll,
  scrollPosition,
  scrollTo,
} from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import { installMotion, page, strip } from './helpers.js'

const controllers: Array<{ destroy: () => void }> = []
const auto = (...args: Parameters<typeof autoScrollTo>) => {
  const controller = autoScrollTo(...args)
  controllers.push(controller)
  return controller
}

beforeEach(() => {
  installMotion(false)
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'Date'],
  })
})

afterEach(() => {
  controllers.splice(0).forEach(controller => controller.destroy())
  document.body.innerHTML = ''
  history.replaceState(null, '', '/')
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const run = (ms = 2000) => vi.advanceTimersByTime(ms)

const sections: Array<[string, number, number?]> = [
  ['intro', 0],
  ['install', 1200],
  ['usage', 2400, 200],
  ['end', 4700, 300],
]

describe('scrollPosition', () => {
  it('aligns to the start, center, end or nearest edge', () => {
    page(sections)
    expect(scrollPosition('#install')).toEqual({ top: 1200, left: 0 })
    // 200px tall in an 800px view: 300px above it.
    expect(scrollPosition('#usage', { block: 'center' })).toEqual({ top: 2100, left: 0 })
    expect(scrollPosition('#usage', { block: 'end' })).toEqual({ top: 1800, left: 0 })
    expect(scrollPosition('#usage', { block: 'nearest' })).toEqual({ top: 1800, left: 0 })
    expect(scrollPosition('#intro', { block: 'nearest' })).toEqual({ top: 0, left: 0 })
  })

  it('keeps an offset above the target', () => {
    const header = document.createElement('header')
    header.getBoundingClientRect = () => ({ height: 64 }) as DOMRect
    document.body.appendChild(header)
    header.id = 'header'
    page(sections)
    expect(scrollPosition('#install', { offset: 80 })!.top).toBe(1120)
    expect(scrollPosition('#install', { offset: '80px' })!.top).toBe(1120)
    expect(scrollPosition('#install', { offset: '10%' })!.top).toBe(1120)
    expect(scrollPosition('#install', { offset: '#header' })!.top).toBe(1136)
    expect(scrollPosition('#install', { offset: header })!.top).toBe(1136)
    expect(scrollPosition('#install', { offset: '.missing' })!.top).toBe(1200)
  })

  it('clamps to what the page can scroll', () => {
    page(sections)
    expect(scrollPosition('#end')!.top).toBe(4200)
    expect(scrollPosition(-50)!.top).toBe(0)
    expect(scrollPosition(1e6)!.top).toBe(4200)
  })

  it('understands top, #ids and selectors, and returns null for unknown targets', () => {
    page(sections)
    expect(scrollPosition('top')!.top).toBe(0)
    expect(scrollPosition('#')!.top).toBe(0)
    expect(scrollPosition('section:nth-of-type(2)')!.top).toBe(1200)
    expect(scrollPosition('#nope')).toBeNull()
    expect(scrollPosition('##bad[')).toBeNull()
    expect(scrollPosition('#%E0%A4%A')).toBeNull()
  })

  it('centers an item inside a horizontal container', () => {
    const { box, items } = strip()
    // Item 5 starts at 800px: centering it in 600px needs 600px of scroll.
    expect(scrollPosition(items[4]!, { container: box, inline: 'center' })).toEqual({
      top: 0,
      left: 600,
    })
    box.id = 'tabs'
    expect(scrollPosition(items[9]!, { container: '#tabs', inline: 'nearest' })!.left).toBe(1400)
    expect(scrollPosition(items[0]!, { container: '#missing' })).toEqual({ top: 0, left: 0 })
  })
})

describe('scrollTo', () => {
  it('animates with easing and resolves true on arrival', async () => {
    const { state } = page(sections)
    const done = scrollTo('#install', { duration: 400, easing: 'linear' })
    vi.advanceTimersByTime(216)
    expect(state.y).toBeGreaterThan(400)
    expect(state.y).toBeLessThan(800)
    run(400)
    await expect(done).resolves.toBe(true)
    expect(state.y).toBe(1200)
  })

  it('scales the duration with the distance', async () => {
    const { state } = page(sections)
    const done = scrollTo('#install')
    // 1200px → 600ms.
    vi.advanceTimersByTime(560)
    expect(state.y).toBeLessThan(1200)
    run(100)
    await expect(done).resolves.toBe(true)
  })

  it('follows a target that moves while it scrolls', async () => {
    const { state } = page(sections)
    const done = scrollTo('#install', { duration: 400 })
    vi.advanceTimersByTime(200)
    state.shift = 300
    run()
    await done
    expect(state.y).toBe(1500)
  })

  it('jumps with behavior instant, reduced motion or no distance', async () => {
    const { state, scrollTo: spy } = page(sections)
    await expect(scrollTo('#install', { behavior: 'instant' })).resolves.toBe(true)
    expect(state.y).toBe(1200)

    installMotion(true)
    await scrollTo('#usage')
    expect(state.y).toBe(2400)

    installMotion(false)
    spy.mockClear()
    await scrollTo('#usage')
    expect(spy).toHaveBeenCalledTimes(1)
    await scrollTo(0, { duration: 0 })
    expect(state.y).toBe(0)
  })

  it('accepts easing functions and ignores unknown names', async () => {
    const { state } = page(sections)
    const easing = vi.fn((t: number) => t)
    const done = scrollTo(1000, { duration: 100, easing })
    run()
    await done
    expect(easing).toHaveBeenCalled()
    expect(state.y).toBe(1000)

    const other = scrollTo(0, { duration: 100, easing: 'bouncy' as 'linear' })
    run()
    await expect(other).resolves.toBe(true)
    expect(EASINGS['ease-out'](0.5)).toBeCloseTo(0.875)
    expect(EASINGS['ease-in-out'](0.75)).toBeCloseTo(0.9375)
  })

  it('stops when the visitor scrolls, and when replaced', async () => {
    const { state } = page(sections)
    const first = scrollTo('#install', { duration: 400 })
    vi.advanceTimersByTime(100)
    window.dispatchEvent(new Event('wheel'))
    await expect(first).resolves.toBe(false)
    const stopped = state.y
    run()
    expect(state.y).toBe(stopped)

    const second = scrollTo('#install', { duration: 400 })
    const third = scrollTo('#usage', { duration: 400 })
    await expect(second).resolves.toBe(false)
    run()
    await expect(third).resolves.toBe(true)
    expect(state.y).toBe(2400)
  })

  it('can ignore the visitor, and be cancelled', async () => {
    page(sections)
    const done = scrollTo('#install', { duration: 400, interruptible: false })
    window.dispatchEvent(new Event('keydown'))
    run()
    await expect(done).resolves.toBe(true)

    const next = scrollTo('#usage', { duration: 400 })
    cancelScroll()
    await expect(next).resolves.toBe(false)
    cancelScroll('#missing')
  })

  it('moves focus and writes the hash once it arrives', async () => {
    page(sections)
    const length = history.length
    const done = scrollTo('#install', { duration: 100, focus: true, hash: 'push' })
    expect(location.hash).toBe('')
    run()
    await done
    const install = document.getElementById('install')!
    expect(document.activeElement).toBe(install)
    expect(install.getAttribute('tabindex')).toBe('-1')
    expect(location.hash).toBe('#install')
    expect(history.length).toBe(length + 1)

    await scrollTo('#usage', { behavior: 'instant', hash: 'replace' })
    expect(location.hash).toBe('#usage')
    expect(history.length).toBe(length + 1)

    // Same hash: no new entry. Top: the hash is removed.
    await scrollTo('#usage', { behavior: 'instant', hash: 'push' })
    expect(history.length).toBe(length + 1)
    await scrollTo('top', { behavior: 'instant', hash: 'replace', focus: true })
    expect(location.hash).toBe('')
  })

  it('keeps focusable targets as they are, and skips the hash without an id', async () => {
    page(sections)
    const button = document.createElement('button')
    button.getBoundingClientRect = () => ({ top: 100, bottom: 120, left: 0, right: 10 }) as DOMRect
    document.body.appendChild(button)
    await scrollTo(button, { behavior: 'instant', focus: true, hash: 'push' })
    expect(document.activeElement).toBe(button)
    expect(button.hasAttribute('tabindex')).toBe(false)
    expect(location.hash).toBe('')
  })

  it('scrolls a container sideways', async () => {
    const { box, items, scrollLeft } = strip()
    await scrollTo(items[4]!, { container: box, inline: 'center', behavior: 'instant' })
    expect(scrollLeft()).toBe(600)
  })

  it('resolves false for missing targets and without a DOM', async () => {
    page(sections)
    await expect(scrollTo('#nope')).resolves.toBe(false)
    vi.stubGlobal('window', undefined)
    await expect(scrollTo('#install')).resolves.toBe(false)
    expect(scrollPosition('#install')).toBeNull()
    expect(autoScrollTo().destroy).toBeTypeOf('function')
    cancelScroll()
  })

  it('exports the same function everywhere', () => {
    expect(defaultExport).toBe(scrollTo)
    expect(vanilla.default).toBe(scrollTo)
  })
})

describe('autoScrollTo', () => {
  /** Click, and report whether the default was prevented (then prevent any navigation). */
  const click = (element: Element, init: MouseEventInit = {}) => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init })
    let prevented = false
    window.addEventListener(
      'click',
      seen => {
        prevented = seen.defaultPrevented
        seen.preventDefault()
      },
      { once: true }
    )
    element.dispatchEvent(event)
    return { defaultPrevented: prevented }
  }

  it('handles same-page links with focus and history', async () => {
    const { state } = page(sections)
    document.body.insertAdjacentHTML('beforeend', '<a id="link" href="#install">Install</a>')
    const controller = auto({ duration: 100 })
    const event = click(document.getElementById('link')!)
    expect(event.defaultPrevented).toBe(true)
    run()
    await Promise.resolve()
    expect(state.y).toBe(1200)
    expect(location.hash).toBe('#install')
    expect(document.activeElement?.id).toBe('install')
    controller.destroy()

    const after = click(document.getElementById('link')!)
    expect(after.defaultPrevented).toBe(false)
  })

  it('handles data-scroll-to triggers with their own options', async () => {
    const { state } = page(sections)
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button id="go" data-scroll-to="#usage" data-scroll-to-offset="100" data-scroll-to-block="start" data-scroll-to-duration="0">Go</button>
       <button id="top" data-scroll-to="top">Top</button>`
    )
    auto({ focus: false, hash: false })
    click(document.getElementById('go')!)
    await Promise.resolve()
    expect(state.y).toBe(2300)
    expect(location.hash).toBe('')

    click(document.getElementById('top')!)
    run()
    expect(state.y).toBe(0)
  })

  it('reads the container and inline alignment from attributes', () => {
    const { box, items, scrollLeft } = strip()
    box.id = 'tabs'
    items[4]!.id = 'tab-5'
    document.body.insertAdjacentHTML(
      'beforeend',
      '<button id="go" data-scroll-to="#tab-5" data-scroll-to-container="#tabs" data-scroll-to-inline="center">5</button>'
    )
    auto({ behavior: 'instant', focus: false })
    click(document.getElementById('go')!)
    expect(scrollLeft()).toBe(600)
  })

  it('leaves other clicks alone', () => {
    page(sections)
    document.body.insertAdjacentHTML(
      'beforeend',
      `<a id="missing" href="#nowhere">Missing</a>
       <a id="away" href="https://example.com/#install">Away</a>
       <a id="same" href="${location.origin}${location.pathname}#install">Same page</a>
       <span id="plain" data-scroll-to="">Plain</span>
       <a id="mod" href="#install">Modifier</a>`
    )
    auto({ behavior: 'instant' })
    expect(click(document.getElementById('missing')!).defaultPrevented).toBe(false)
    expect(click(document.getElementById('away')!).defaultPrevented).toBe(false)
    expect(click(document.getElementById('plain')!).defaultPrevented).toBe(false)
    expect(click(document.getElementById('mod')!, { metaKey: true }).defaultPrevented).toBe(false)
    expect(click(document.getElementById('mod')!, { button: 1 }).defaultPrevented).toBe(false)
    expect(click(document.body).defaultPrevented).toBe(false)

    const prevented = document.getElementById('mod')!
    prevented.addEventListener('click', event => event.preventDefault(), { once: true })
    const spy = vi.mocked(window.scrollTo)
    spy.mockClear()
    click(prevented)
    expect(spy).not.toHaveBeenCalled()

    // A full URL to this page counts as a same-page link.
    expect(click(document.getElementById('same')!).defaultPrevented).toBe(false)
    auto({ selector: 'a[href*="#"]', behavior: 'instant' })
    expect(click(document.getElementById('same')!).defaultPrevented).toBe(true)
  })

  it('only listens inside its scope', () => {
    page(sections)
    document.body.insertAdjacentHTML(
      'beforeend',
      '<nav id="menu"><a id="in" href="#install">In</a></nav><a id="out" href="#install">Out</a>'
    )
    auto({ scope: document.getElementById('menu')!, behavior: 'instant' })
    expect(click(document.getElementById('in')!).defaultPrevented).toBe(true)
    expect(click(document.getElementById('out')!).defaultPrevented).toBe(false)
  })

  it('aligns the URL hash with the offset on load', () => {
    const { state } = page(sections)
    history.replaceState(null, '', '/#install')
    const ready = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    const controller = auto({ offset: 80 })
    expect(state.y).toBe(0)
    window.dispatchEvent(new Event('load'))
    expect(state.y).toBe(1120)

    ready.mockReturnValue('complete')
    state.y = 0
    auto({ offset: 80 })
    expect(state.y).toBe(1120)

    state.y = 0
    auto({ offset: 80, initialHash: false })
    auto()
    expect(state.y).toBe(0)
    controller.destroy()
  })
})
