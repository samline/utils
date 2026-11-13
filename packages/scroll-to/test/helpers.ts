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

const VIEWPORT = { width: 1000, height: 800 }

/**
 * A page `height` pixels tall with sections at fixed document positions.
 * `window.scrollTo` moves the page; `scrollY` reads it.
 */
export const page = (
  sections: Array<[id: string, top: number, height?: number]>,
  { height = 5000 }: { height?: number } = {}
) => {
  const state = { x: 0, y: 0, height, shift: 0 }
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => state.y })
  Object.defineProperty(window, 'scrollX', { configurable: true, get: () => state.x })
  const root = document.documentElement
  Object.defineProperty(document, 'scrollingElement', { configurable: true, value: root })
  Object.defineProperty(root, 'clientHeight', { configurable: true, value: VIEWPORT.height })
  Object.defineProperty(root, 'clientWidth', { configurable: true, value: VIEWPORT.width })
  Object.defineProperty(root, 'scrollHeight', { configurable: true, get: () => state.height })
  Object.defineProperty(root, 'scrollWidth', { configurable: true, value: VIEWPORT.width })

  const scrollTo = vi.fn((options: ScrollToOptions) => {
    state.y = options.top ?? state.y
    state.x = options.left ?? state.x
  })
  vi.stubGlobal('scrollTo', scrollTo)

  const nodes = sections.map(([id, top, size = 400]) => {
    const section = document.createElement('section')
    section.id = id
    section.getBoundingClientRect = () => {
      const y = top + state.shift - state.y
      return { top: y, bottom: y + size, height: size, left: 0, right: 500, width: 500 } as DOMRect
    }
    document.body.appendChild(section)
    return section
  })

  return { state, nodes, scrollTo }
}

/** A horizontal strip of `count` items, each 200px wide, inside a 600px box. */
export const strip = (count = 10) => {
  const box = document.createElement('div')
  let left = 0
  Object.defineProperty(box, 'clientWidth', { configurable: true, value: 600 })
  Object.defineProperty(box, 'clientHeight', { configurable: true, value: 100 })
  Object.defineProperty(box, 'scrollWidth', { configurable: true, value: count * 200 })
  Object.defineProperty(box, 'scrollHeight', { configurable: true, value: 100 })
  Object.defineProperty(box, 'scrollLeft', { configurable: true, get: () => left })
  Object.defineProperty(box, 'scrollTop', { configurable: true, value: 0 })
  box.getBoundingClientRect = () => ({ top: 0, left: 100, width: 600, height: 100 }) as DOMRect
  box.scrollTo = vi.fn((options: ScrollToOptions) => {
    left = options.left ?? left
  }) as typeof box.scrollTo
  const items = Array.from({ length: count }, (_, index) => {
    const item = document.createElement('button')
    item.getBoundingClientRect = () => {
      const x = 100 + index * 200 - left
      return { top: 0, bottom: 100, left: x, right: x + 200, width: 200, height: 100 } as DOMRect
    }
    box.appendChild(item)
    return item
  })
  document.body.appendChild(box)
  return { box, items, scrollLeft: () => left }
}
