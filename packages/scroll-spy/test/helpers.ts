import { vi } from 'vitest'

let reduced = false

/** A controllable `prefers-reduced-motion` media query. */
export const installMotion = (initial = false) => {
  reduced = initial
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('reduce') ? reduced : false
    },
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

const VIEWPORT = 800

/**
 * A page with a navigation and sections at fixed document positions.
 * `scrollTo(y)` moves the page and emits a scroll event.
 */
export const page = (
  sections: Array<[id: string, top: number]>,
  { height = 4000, navHtml }: { height?: number; navHtml?: string } = {}
) => {
  let scrollY = 0
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: VIEWPORT })
  const doc = document.documentElement
  Object.defineProperty(doc, 'clientHeight', { configurable: true, value: VIEWPORT })
  Object.defineProperty(doc, 'scrollHeight', { configurable: true, value: height })

  const nav = document.createElement('nav')
  nav.setAttribute('data-scroll-spy', '')
  nav.innerHTML = navHtml ?? sections.map(([id]) => `<a href="#${id}">${id}</a>`).join('')
  document.body.appendChild(nav)

  const nodes = sections.map(([id, top]) => {
    const section = document.createElement('section')
    section.id = id
    section.getBoundingClientRect = () =>
      ({ top: top - scrollY, bottom: top - scrollY + 300, height: 300 }) as DOMRect
    document.body.appendChild(section)
    return section
  })

  const link = (id: string) => nav.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`)!
  const scrollTo = (y: number) => {
    scrollY = y
    window.dispatchEvent(new Event('scroll'))
  }
  return { nav, nodes, link, scrollTo }
}

/** Ids of links with aria-current. */
export const current = (nav: Element) =>
  [...nav.querySelectorAll('[aria-current]')].map(link => link.getAttribute('href'))
