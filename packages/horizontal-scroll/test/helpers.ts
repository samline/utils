import { vi } from 'vitest'

type Listener = (event: { matches: boolean }) => void

const state = { reduced: false, wide: true }
const listeners = new Map<string, Set<Listener>>()

/**
 * A controllable `matchMedia`: `prefers-reduced-motion` follows `reduced`,
 * every other query follows `wide`.
 */
export const installMedia = ({ reduced = false, wide = true } = {}) => {
  state.reduced = reduced
  state.wide = wide
  listeners.clear()
  vi.stubGlobal('matchMedia', (query: string) => {
    const key = query.includes('reduce') ? 'reduced' : 'wide'
    const set = listeners.get(key) ?? new Set<Listener>()
    listeners.set(key, set)
    return {
      get matches() {
        return state[key]
      },
      media: query,
      addEventListener: (_: string, fn: Listener) => set.add(fn),
      removeEventListener: (_: string, fn: Listener) => set.delete(fn),
    }
  })
}

export const setMedia = (key: 'reduced' | 'wide', value: boolean) => {
  state[key] = value
  listeners.get(key)?.forEach(fn => fn({ matches: value }))
}

export const listenerCount = () => [...listeners.values()].reduce((sum, set) => sum + set.size, 0)

/** A ResizeObserver whose callback runs on demand. */
export class MockResizeObserver {
  static instances: MockResizeObserver[] = []
  readonly observed = new Set<Element>()
  constructor(private readonly callback: () => void) {
    MockResizeObserver.instances.push(this)
  }
  observe = (element: Element) => void this.observed.add(element)
  unobserve = (element: Element) => void this.observed.delete(element)
  disconnect = () => this.observed.clear()
  fire = () => this.callback()
}

export const installResizeObserver = () => {
  MockResizeObserver.instances = []
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
}

const VIEWPORT = { width: 1000, height: 800 }

/**
 * A page with a horizontal-scroll section starting at `sectionTop` and a
 * track `trackWidth` pixels wide inside a 1000 × 800 viewport.
 * `scrollTo(y)` moves the page and emits a scroll event.
 */
export const page = ({
  sectionTop = 1000,
  trackWidth = 3000,
  trackHeight = 600,
  items = 6,
  attributes = {},
  maxContent = false,
}: {
  sectionTop?: number
  trackWidth?: number
  trackHeight?: number
  items?: number
  attributes?: Record<string, string>
  maxContent?: boolean
} = {}) => {
  let scrollY = 0
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrollY })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: VIEWPORT.height })
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: VIEWPORT.width })

  const section = document.createElement('section')
  section.setAttribute('data-horizontal-scroll', '')
  Object.entries(attributes).forEach(([name, value]) => section.setAttribute(name, value))
  const track = document.createElement('div')
  track.setAttribute('data-horizontal-scroll-track', '')
  const itemWidth = trackWidth / items
  for (let index = 0; index < items; index++) {
    const item = document.createElement('a')
    item.href = '#'
    item.textContent = `Item ${index + 1}`
    item.getBoundingClientRect = () => {
      const left = index * itemWidth + shift()
      return { left, right: left + itemWidth, top: 0, bottom: trackHeight } as DOMRect
    }
    track.appendChild(item)
  }
  section.appendChild(track)
  document.body.appendChild(section)

  const shift = () => parseFloat(track.style.translate || '0') || 0

  Object.defineProperty(section, 'clientWidth', { configurable: true, value: VIEWPORT.width })
  section.getBoundingClientRect = () =>
    ({ top: sectionTop - scrollY, left: 0, right: VIEWPORT.width }) as DOMRect
  const sizes = { width: trackWidth, height: trackHeight }
  Object.defineProperty(track, 'scrollWidth', { configurable: true, get: () => sizes.width })
  Object.defineProperty(track, 'clientWidth', {
    configurable: true,
    get: () => (maxContent ? sizes.width : VIEWPORT.width),
  })
  Object.defineProperty(track, 'offsetWidth', {
    configurable: true,
    get: () => (maxContent ? sizes.width : VIEWPORT.width),
  })
  Object.defineProperty(track, 'offsetHeight', { configurable: true, get: () => sizes.height })

  const scrollTo = (y: number) => {
    scrollY = y
    window.dispatchEvent(new Event('scroll'))
  }
  vi.stubGlobal(
    'scrollTo',
    vi.fn((options: ScrollToOptions) => scrollTo(options.top ?? 0))
  )
  return { section, track, sizes, scrollTo, shift, items: [...track.children] as HTMLElement[] }
}
