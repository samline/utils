import { vi } from 'vitest'

import { resetObservers } from '../../is-visible/src/core/pool.js'

const VIEWPORT = 800

/** Where an element is relative to an 800px viewport when an entry is emitted. */
export type Position = 'in' | 'below' | 'above' | 'hidden'

export class MockObserver {
  static instances: MockObserver[] = []
  readonly observed = new Set<Element>()

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {}
  ) {
    MockObserver.instances.push(this)
  }

  observe = vi.fn((el: Element) => void this.observed.add(el))
  unobserve = vi.fn((el: Element) => void this.observed.delete(el))
  disconnect = vi.fn(() => this.observed.clear())
  takeRecords = () => []

  emit(target: Element, position: Position) {
    if (!this.observed.has(target)) return
    const top = { in: 100, below: VIEWPORT + 200, above: -500, hidden: 0 }[position]
    const height = position === 'hidden' ? 0 : 200
    const isIntersecting = position === 'in'
    this.callback(
      [
        {
          target,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
          boundingClientRect: { top, bottom: top + height, height } as DOMRectReadOnly,
          rootBounds: { top: 0, bottom: VIEWPORT, height: VIEWPORT } as DOMRectReadOnly,
        } as unknown as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver
    )
  }
}

export const installMock = () => {
  resetObservers()
  MockObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockObserver)
}

/** Emit on every live observer watching `target`. */
export const emit = (target: Element, position: Position) =>
  MockObserver.instances.forEach(o => o.emit(target, position))

let reduced = false
const listeners = new Set<(event: { matches: boolean }) => void>()

/** A controllable `prefers-reduced-motion` media query. */
export const installMotion = (initial = false) => {
  reduced = initial
  listeners.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('reduce') ? reduced : false
    },
    media: query,
    addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: (event: { matches: boolean }) => void) =>
      listeners.delete(fn),
  }))
}

export const setReducedMotion = (value: boolean) => {
  reduced = value
  listeners.forEach(fn => fn({ matches: value }))
}

export const el = (
  attributes: Record<string, string> = { 'data-reveal': '' },
  parent?: Element
) => {
  const node = document.createElement('div')
  Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value))
  ;(parent ?? document.body).appendChild(node)
  return node
}

/** Let queued microtasks (the cascade flush) run. */
export const tick = () => new Promise<void>(resolve => queueMicrotask(resolve))

export const state = (node: Element) => node.getAttribute('data-reveal-state')
