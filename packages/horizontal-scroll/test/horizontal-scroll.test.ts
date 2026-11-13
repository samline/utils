import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import defaultExport, { autoHorizontalScroll, horizontalScroll } from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import {
  MockResizeObserver,
  installMedia,
  installResizeObserver,
  listenerCount,
  page,
  setMedia,
} from './helpers.js'

beforeEach(() => {
  installMedia()
  installResizeObserver()
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] })
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const frame = () => vi.advanceTimersByTime(20)

describe('pinning', () => {
  it('sizes the section to scroll through the whole track and pins the track', () => {
    const { section, track } = page()
    const scroller = horizontalScroll(section)

    expect(scroller.active).toBe(true)
    expect(section.getAttribute('data-horizontal-scroll-state')).toBe('active')
    // 600px of track + 2000px of sideways travel.
    expect(section.style.height).toBe('2600px')
    expect(track.style.position).toBe('sticky')
    expect(track.style.top).toBe('0px')
    expect(track.style.translate).toBe('0px 0')
  })

  it('moves the track with the vertical scroll and clamps at both ends', () => {
    const { section, track, scrollTo } = page()
    const onProgress = vi.fn()
    const scroller = horizontalScroll(section, { onProgress })

    scrollTo(500)
    frame()
    expect(scroller.progress).toBe(0)
    expect(onProgress).not.toHaveBeenCalled()

    scrollTo(2000)
    frame()
    expect(scroller.progress).toBe(0.5)
    expect(track.style.translate).toBe('-1000px 0')
    expect(section.style.getPropertyValue('--horizontal-scroll-progress')).toBe('0.5')
    expect(onProgress).toHaveBeenLastCalledWith({ progress: 0.5, x: -1000, distance: 2000 })

    scrollTo(5000)
    frame()
    expect(scroller.progress).toBe(1)
    expect(track.style.translate).toBe('-2000px 0')
  })

  it('reads the scroll once per frame', () => {
    const { section, scrollTo } = page()
    const read = vi.spyOn(section, 'getBoundingClientRect')
    horizontalScroll(section)
    read.mockClear()

    scrollTo(1500)
    scrollTo(1600)
    scrollTo(1700)
    frame()
    expect(read).toHaveBeenCalledTimes(1)
  })

  it('applies speed and a top offset', () => {
    const { section, track, scrollTo } = page()
    const scroller = horizontalScroll(section, { speed: 2, top: '10%' })

    // 2000px of travel over 1000px of scrolling; pinned 80px down.
    expect(section.style.height).toBe('1600px')
    expect(track.style.top).toBe('80px')

    scrollTo(1420)
    frame()
    expect(scroller.progress).toBe(0.5)
  })

  it('reads its options from attributes', () => {
    const { section, track } = page({
      attributes: {
        'data-horizontal-scroll-speed': '4',
        'data-horizontal-scroll-top': '64',
      },
    })
    horizontalScroll(section, { speed: 1, top: 0 })
    expect(section.style.height).toBe('1100px')
    expect(track.style.top).toBe('64px')
  })

  it('ignores invalid speeds and tops', () => {
    const { section, track } = page({ attributes: { 'data-horizontal-scroll-speed': '-2' } })
    horizontalScroll(section, { top: 'auto' })
    expect(section.style.height).toBe('2600px')
    expect(track.style.top).toBe('0px')
  })

  it('handles a track wider than the section (width: max-content)', () => {
    const { section } = page({ maxContent: true, trackWidth: 2500 })
    horizontalScroll(section)
    expect(section.style.height).toBe('2100px')
  })

  it('pins without travel when the track fits', () => {
    const { section, scrollTo } = page({ trackWidth: 900 })
    const scroller = horizontalScroll(section)
    expect(section.style.height).toBe('600px')
    scrollTo(1300)
    frame()
    expect(scroller.progress).toBe(0)
  })

  it('measures again when the content or the window changes size', () => {
    const { section, sizes } = page()
    horizontalScroll(section)
    const observer = MockResizeObserver.instances[0]!
    expect(observer.observed.size).toBe(7)

    sizes.width = 4000
    observer.fire()
    expect(section.style.height).toBe('3600px')

    sizes.height = 700
    window.dispatchEvent(new Event('resize'))
    expect(section.style.height).toBe('3700px')
  })

  it('works without ResizeObserver', () => {
    vi.stubGlobal('ResizeObserver', undefined)
    const { section } = page()
    expect(horizontalScroll(section).active).toBe(true)
  })
})

describe('track', () => {
  it('falls back to the first child without a track attribute', () => {
    const { section, track } = page()
    track.removeAttribute('data-horizontal-scroll-track')
    horizontalScroll(section)
    expect(track.style.position).toBe('sticky')
  })

  it('accepts a selector or an element', () => {
    const { section, track } = page()
    track.className = 'row'
    horizontalScroll(section, { track: '.row' })
    expect(track.style.position).toBe('sticky')

    const other = page()
    horizontalScroll(other.section, { track: other.track })
    expect(other.track.style.position).toBe('sticky')
  })

  it('stays inactive when the track is missing', () => {
    const { section, track } = page()
    const scroller = horizontalScroll(section, { track: '.missing' })
    expect(scroller.active).toBe(false)
    expect(section.getAttribute('data-horizontal-scroll-state')).toBe('inactive')
    expect(track.style.position).toBe('')
  })

  it('switches to a new track on refresh', () => {
    const { section, track } = page()
    const scroller = horizontalScroll(section)
    const next = document.createElement('div')
    next.setAttribute('data-horizontal-scroll-track', '')
    track.replaceWith(next)
    scroller.refresh()
    expect(next.style.position).toBe('sticky')
    expect(track.style.position).toBe('')
  })
})

describe('media and reduced motion', () => {
  it('only runs while the media query matches', () => {
    installMedia({ wide: false })
    const { section, track, scrollTo } = page()
    const onProgress = vi.fn()
    const scroller = horizontalScroll(section, { media: '(min-width: 768px)', onProgress })
    expect(scroller.active).toBe(false)
    expect(section.getAttribute('data-horizontal-scroll-state')).toBe('inactive')

    setMedia('wide', true)
    expect(scroller.active).toBe(true)
    scrollTo(2000)
    frame()
    expect(scroller.progress).toBe(0.5)

    setMedia('wide', false)
    expect(scroller.active).toBe(false)
    expect(scroller.progress).toBe(0)
    expect(onProgress).toHaveBeenLastCalledWith({ progress: 0, x: 0, distance: 2000 })
    expect(section.style.height).toBe('')
    expect(track.style.translate).toBe('')
  })

  it('reads the media query from an attribute', () => {
    installMedia({ wide: false })
    const { section } = page({ attributes: { 'data-horizontal-scroll-media': '(width > 1px)' } })
    expect(horizontalScroll(section).active).toBe(false)
  })

  it('turns off with reduced motion unless asked to keep it', () => {
    installMedia({ reduced: true })
    const { section } = page()
    const scroller = horizontalScroll(section)
    expect(scroller.active).toBe(false)

    setMedia('reduced', false)
    expect(scroller.active).toBe(true)
    setMedia('reduced', true)
    expect(scroller.active).toBe(false)

    const other = page()
    expect(horizontalScroll(other.section, { respectReducedMotion: false }).active).toBe(true)
  })
})

describe('keyboard focus', () => {
  it('scrolls the page so a focused item is fully visible', () => {
    const { section, items, scrollTo, shift } = page()
    const scroller = horizontalScroll(section)
    scrollTo(1000)
    frame()

    // Item 4 spans 1500–2000: the track must move 1000px.
    items[3]!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 2000, behavior: 'instant' })
    expect(scroller.progress).toBe(0.5)
    expect(shift()).toBe(-1000)

    // Item 1 spans 0–500: back to the start.
    items[0]!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(window.scrollTo).toHaveBeenLastCalledWith({ top: 1000, behavior: 'instant' })
  })

  it('leaves the page alone when the item is visible, or when disabled', () => {
    const { section, items, track } = page()
    horizontalScroll(section)
    items[0]!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    track.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(window.scrollTo).not.toHaveBeenCalled()

    const other = page({ attributes: { 'data-horizontal-scroll-focus': 'false' } })
    horizontalScroll(other.section)
    other.items[5]!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(window.scrollTo).not.toHaveBeenCalled()
  })
})

describe('destroy', () => {
  it('restores every style and stops listening', () => {
    const { section, track, scrollTo } = page()
    section.style.height = '50vh'
    track.style.setProperty('top', '5px', 'important')
    const onProgress = vi.fn()
    const scroller = horizontalScroll(section, { media: '(width > 0)', onProgress })
    scroller.destroy()
    scroller.destroy()

    expect(section.style.height).toBe('50vh')
    expect(track.style.getPropertyValue('top')).toBe('5px')
    expect(track.style.getPropertyPriority('top')).toBe('important')
    expect(track.style.position).toBe('')
    expect(section.hasAttribute('data-horizontal-scroll-state')).toBe(false)
    expect(listenerCount()).toBe(0)

    scrollTo(2000)
    frame()
    scroller.refresh()
    expect(onProgress).not.toHaveBeenCalled()
    expect(track.style.position).toBe('')
  })
})

describe('entry points', () => {
  it('returns an inert instance without a section or a DOM', () => {
    const scroller = horizontalScroll('#missing')
    expect(scroller.active).toBe(false)
    scroller.refresh()
    scroller.destroy()

    vi.stubGlobal('window', undefined)
    expect(horizontalScroll('#missing').progress).toBe(0)
  })

  it('exports the same function everywhere', () => {
    expect(defaultExport).toBe(horizontalScroll)
    expect(vanilla.default).toBe(horizontalScroll)
  })

  it('sets up every section, including ones added later', async () => {
    const first = page()
    const controller = autoHorizontalScroll({ speed: 2 })
    expect(first.section.style.height).toBe('1600px')

    const second = page()
    await Promise.resolve()
    expect(second.track.style.position).toBe('sticky')

    second.section.remove()
    await Promise.resolve()
    expect(second.track.style.position).toBe('')

    controller.destroy()
    expect(first.section.style.height).toBe('')
  })

  it('accepts a scope and a selector', () => {
    const { section } = page()
    section.classList.add('pinned')
    const controller = autoHorizontalScroll({
      selector: '.pinned',
      scope: document.body,
      observe: false,
    })
    expect(section.getAttribute('data-horizontal-scroll-state')).toBe('active')
    controller.destroy()
  })
})

describe('scroll container', () => {
  it('follows a root element instead of the page', () => {
    const { section, track, items } = page()
    const box = document.createElement('div')
    document.body.appendChild(box)
    box.appendChild(section)
    let scrollTop = 0
    Object.defineProperty(box, 'clientHeight', { configurable: true, value: 400 })
    Object.defineProperty(box, 'clientTop', { configurable: true, value: 0 })
    Object.defineProperty(box, 'scrollTop', { configurable: true, get: () => scrollTop })
    box.getBoundingClientRect = () => ({ top: 100 }) as DOMRect
    // The section starts 200px into the box.
    section.getBoundingClientRect = () =>
      ({ top: 100 + 200 - scrollTop, left: 0, right: 1000 }) as DOMRect
    box.scrollTo = vi.fn((options: ScrollToOptions) => {
      scrollTop = options.top ?? 0
      box.dispatchEvent(new Event('scroll'))
    }) as typeof box.scrollTo

    const scroller = horizontalScroll(section, { root: box, top: '25%' })
    expect(track.style.top).toBe('100px')

    box.scrollTo({ top: 1100 })
    frame()
    expect(scroller.progress).toBe(0.5)

    items[5]!.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(box.scrollTo).toHaveBeenLastCalledWith({ top: 2100, behavior: 'instant' })
    expect(window.scrollTo).not.toHaveBeenCalled()
    scroller.destroy()
  })
})
