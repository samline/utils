import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import spyDefault, { autoScrollSpy, scrollSpy } from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import { current, installMotion, page } from './helpers.js'

beforeEach(() => {
  installMotion(false)
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout'],
  })
})

afterEach(() => {
  document.body.innerHTML = ''
  history.replaceState(null, '', '/')
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

const frame = () => vi.advanceTimersByTime(20)

const sections: Array<[string, number]> = [
  ['intro', 400],
  ['install', 1200],
  ['usage', 2000],
  ['faq', 3600],
]

describe('active section', () => {
  it('activates the last section whose top crossed the line at 25% of the viewport', () => {
    const { nav, scrollTo } = page(sections)
    const spy = scrollSpy(nav)
    // Line at 200px: intro starts at 400, so nothing yet.
    expect(spy.active).toBeNull()
    expect(current(nav)).toEqual([])

    scrollTo(250)
    frame()
    expect(spy.active).toBe('intro')
    expect(current(nav)).toEqual(['#intro'])

    scrollTo(1500)
    frame()
    expect(spy.active).toBe('install')
    expect(current(nav)).toEqual(['#install'])
  })

  it('activates the last section in view at the bottom of the page', () => {
    const { nav, scrollTo } = page(sections)
    const spy = scrollSpy(nav)
    // Bottom: 4000 - 800. faq (3600) is in view but below the line (3400).
    scrollTo(3200)
    frame()
    expect(spy.active).toBe('faq')
  })

  it('reads the offset as pixels, a percentage, or the attribute', () => {
    const { nav, scrollTo } = page(sections)
    const pixels = scrollSpy(nav, { offset: 0 })
    scrollTo(350)
    frame()
    expect(pixels.active).toBeNull()
    pixels.destroy()

    nav.setAttribute('data-scroll-spy-offset', '50%')
    const percent = scrollSpy(nav, { offset: 0 })
    frame()
    expect(percent.active).toBe('intro')
    percent.destroy()

    nav.setAttribute('data-scroll-spy-offset', 'nonsense')
    const fallback = scrollSpy(nav)
    frame()
    // Invalid values fall back to 25%: line at 550, intro at 50.
    expect(fallback.active).toBe('intro')
  })

  it('reports changes with the section, its links and the previous id', () => {
    const { nav, nodes, link, scrollTo } = page(sections)
    const onChange = vi.fn()
    scrollSpy(nav, { onChange })
    scrollTo(1500)
    frame()
    expect(onChange).toHaveBeenLastCalledWith({
      id: 'install',
      section: nodes[1],
      links: [link('install')],
      previous: null,
    })
    scrollTo(0)
    frame()
    expect(onChange).toHaveBeenLastCalledWith({
      id: null,
      section: null,
      links: [],
      previous: 'install',
    })
  })
})

describe('links', () => {
  it('marks every link to the section, ignores other pages and missing targets', () => {
    const { nav, scrollTo } = page(sections, {
      navHtml: `
        <a href="#intro">Intro</a>
        <a href="${location.pathname}#intro">Intro again</a>
        <a href="/elsewhere#intro">Other page</a>
        <a href="#">Top</a>
        <a href="#missing">Missing</a>
        <a href="#%E2%9C%93">Encoded</a>`,
    })
    const check = document.createElement('section')
    check.id = '✓'
    check.getBoundingClientRect = () => ({ top: 5000 }) as DOMRect
    document.body.appendChild(check)

    scrollSpy(nav)
    scrollTo(250)
    frame()
    expect(current(nav)).toEqual(['#intro', `${location.pathname}#intro`])
  })

  it('uses a custom aria-current value, a class, or neither', () => {
    const { nav, link, scrollTo } = page(sections)
    scrollSpy(nav, { ariaCurrent: 'location', activeClass: 'is-active' })
    scrollTo(250)
    frame()
    expect(link('intro').getAttribute('aria-current')).toBe('location')
    expect(link('intro').classList.contains('is-active')).toBe(true)
    document.body.innerHTML = ''

    const second = page(sections)
    second.nav.setAttribute('data-scroll-spy-class', 'on')
    scrollSpy(second.nav, { ariaCurrent: false })
    second.scrollTo(250)
    frame()
    expect(current(second.nav)).toEqual([])
    expect(second.link('intro').className).toBe('on')
  })

  it('updates the hash without adding history entries when asked', () => {
    const { nav, scrollTo } = page(sections)
    const length = history.length
    scrollSpy(nav, { updateHash: true })
    scrollTo(1500)
    frame()
    expect(location.hash).toBe('#install')
    scrollTo(0)
    frame()
    expect(location.hash).toBe('')
    expect(history.length).toBe(length)
  })
})

describe('clicks', () => {
  it('counts clicks whose default was prevented, as for scripted scrolling', () => {
    const { nav, link } = page(sections)
    nav.addEventListener('click', event => event.preventDefault(), { capture: true })
    const spy = scrollSpy(nav)
    link('faq').click()
    expect(spy.active).toBe('faq')
  })

  it('activates a clicked link and keeps it while the page scrolls to it', () => {
    const { nav, link, scrollTo } = page(sections)
    const spy = scrollSpy(nav)
    link('usage').click()
    expect(spy.active).toBe('usage')

    // Smooth scrolling passes over install: still usage.
    scrollTo(800)
    frame()
    scrollTo(1500)
    frame()
    expect(spy.active).toBe('usage')

    // Quiet for a moment: back to the position.
    scrollTo(1900)
    vi.advanceTimersByTime(200)
    expect(spy.active).toBe('usage')
    scrollTo(1300)
    frame()
    expect(spy.active).toBe('install')
  })

  it('does not lock without lockOnClick and ignores modified clicks', () => {
    const { nav, link, scrollTo } = page(sections)
    nav.setAttribute('data-scroll-spy-lock', 'false')
    const spy = scrollSpy(nav)
    link('usage').click()
    scrollTo(1500)
    frame()
    expect(spy.active).toBe('install')

    link('faq').dispatchEvent(new MouseEvent('click', { bubbles: true, metaKey: true }))
    expect(spy.active).toBe('install')
    link('faq').dispatchEvent(new MouseEvent('click', { bubbles: true, button: 1 }))
    expect(spy.active).toBe('install')

    // Clicks outside links or on unknown links do nothing.
    nav.insertAdjacentHTML('beforeend', '<span id="x">x</span><a href="/a">a</a>')
    nav.querySelector('#x')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    nav
      .querySelector<HTMLAnchorElement>('a[href="/a"]')!
      .dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    expect(spy.active).toBe('install')
  })
})

describe('scroll containers', () => {
  it('measures against the root element', () => {
    const { nav, nodes } = page(sections)
    const root = document.createElement('div')
    document.body.appendChild(root)
    let scrollTop = 0
    Object.defineProperty(root, 'scrollTop', { configurable: true, get: () => scrollTop })
    Object.defineProperty(root, 'clientHeight', { configurable: true, value: 400 })
    Object.defineProperty(root, 'scrollHeight', { configurable: true, value: 4000 })
    // The container starts 100px down and is 400px tall: line at 200.
    root.getBoundingClientRect = () => ({ top: 100, bottom: 500, height: 400 }) as DOMRect
    nodes.forEach((node, i) => {
      const top = sections[i]![1]
      node.getBoundingClientRect = () => ({ top: top - scrollTop }) as DOMRect
    })

    const spy = scrollSpy(nav, { root })
    scrollTop = 1100
    root.dispatchEvent(new Event('scroll'))
    frame()
    expect(spy.active).toBe('install')

    // Window scrolling is ignored.
    scrollTop = 0
    window.dispatchEvent(new Event('scroll'))
    frame()
    expect(spy.active).toBe('install')
  })

  it('scrolls a scrollable navigation so the active link stays in view', () => {
    const { nav, link, scrollTo } = page(sections)
    Object.defineProperty(nav, 'scrollHeight', { configurable: true, value: 600 })
    Object.defineProperty(nav, 'clientHeight', { configurable: true, value: 100 })
    nav.getBoundingClientRect = () => ({ top: 0, bottom: 100, height: 100 }) as DOMRect
    link('usage').getBoundingClientRect = () => ({ top: 300, bottom: 320, height: 20 }) as DOMRect
    link('intro').getBoundingClientRect = () => ({ top: 10, bottom: 30, height: 20 }) as DOMRect
    nav.scrollTo = vi.fn() as never
    const pageScroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    scrollSpy(nav)
    scrollTo(250)
    frame()
    // intro is already visible inside the navigation.
    expect(nav.scrollTo).not.toHaveBeenCalled()

    scrollTo(2100)
    frame()
    expect(nav.scrollTo).toHaveBeenCalledWith({ top: 260, behavior: 'smooth' })
    expect(pageScroll).not.toHaveBeenCalled()

    installMotion(true)
    scrollTo(1300)
    frame()
    scrollTo(2100)
    frame()
    expect(nav.scrollTo).toHaveBeenLastCalledWith({ top: 260, behavior: 'auto' })
  })

  it('leaves non-scrollable navigations and followActive: false alone', () => {
    const { nav, scrollTo } = page(sections)
    nav.scrollTo = vi.fn() as never
    scrollSpy(nav, { followActive: false })
    scrollTo(250)
    frame()
    expect(nav.scrollTo).not.toHaveBeenCalled()
  })
})

describe('lifecycle', () => {
  it('restores attributes and classes and stops listening on destroy', () => {
    const { nav, link, scrollTo } = page(sections)
    link('install').setAttribute('aria-current', 'step')
    const spy = scrollSpy(nav, { activeClass: 'on' })
    scrollTo(250)
    frame()
    expect(link('install').hasAttribute('aria-current')).toBe(false)

    spy.destroy()
    spy.destroy()
    expect(current(nav)).toEqual(['#install'])
    expect(link('install').getAttribute('aria-current')).toBe('step')
    expect(link('intro').className).toBe('')

    scrollTo(1500)
    frame()
    expect(link('install').getAttribute('aria-current')).toBe('step')
    expect(spy.active).toBe('intro')
  })

  it('refresh picks up new links and releases removed ones', () => {
    const { nav, link, scrollTo } = page(sections)
    const spy = scrollSpy(nav)
    scrollTo(250)
    frame()
    link('intro').remove()
    const extra = document.createElement('section')
    extra.id = 'extra'
    extra.getBoundingClientRect = () => ({ top: 100 }) as DOMRect
    document.body.insertBefore(extra, document.body.firstChild)
    nav.insertAdjacentHTML('afterbegin', '<a href="#extra">extra</a>')

    spy.refresh()
    expect(spy.active).toBe('extra')
    spy.destroy()
    spy.refresh()
    expect(spy.active).toBe('extra')
  })

  it('returns an inert spy without a navigation or a DOM', () => {
    expect(scrollSpy('.missing').active).toBeNull()
    expect(() => scrollSpy('.missing').destroy()).not.toThrow()
    vi.stubGlobal('window', undefined)
    const spy = scrollSpy('nav')
    expect(() => spy.refresh()).not.toThrow()
    expect(spyDefault).toBe(scrollSpy)
    expect(vanilla.default).toBe(scrollSpy)
  })

  it('autoScrollSpy watches every navigation, including later ones', async () => {
    vi.useRealTimers()
    const settle = () => new Promise(resolve => setTimeout(resolve, 0))
    const { nav, scrollTo } = page(sections)
    const controller = autoScrollSpy({ activeClass: 'on' })
    scrollTo(250)
    await new Promise(resolve => requestAnimationFrame(resolve))
    expect(current(nav)).toEqual(['#intro'])

    const later = nav.cloneNode(true) as HTMLElement
    later.querySelectorAll('[aria-current]').forEach(link => link.removeAttribute('aria-current'))
    document.body.appendChild(later)
    await settle()
    expect(current(later)).toEqual(['#intro'])

    controller.destroy()
    expect(current(nav)).toEqual([])
  })
})
