import { vi } from 'vitest'

import { resetObservers } from '../src/core/pool.js'

export class MockObserver {
  static instances: MockObserver[] = []
  readonly observed = new Set<Element>()
  disconnected = false

  constructor(
    private readonly callback: IntersectionObserverCallback,
    readonly options: IntersectionObserverInit = {}
  ) {
    MockObserver.instances.push(this)
  }

  observe = vi.fn((el: Element) => {
    this.observed.add(el)
  })
  unobserve = vi.fn((el: Element) => {
    this.observed.delete(el)
  })
  disconnect = vi.fn(() => {
    this.disconnected = true
    this.observed.clear()
  })
  takeRecords = () => []

  /** Deliver an entry for `target` if this observer watches it. */
  emit(target: Element, isIntersecting: boolean, intersectionRatio = isIntersecting ? 1 : 0) {
    if (!this.observed.has(target)) return
    this.callback(
      [{ target, isIntersecting, intersectionRatio } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver
    )
  }
}

export const installMock = () => {
  resetObservers()
  MockObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockObserver)
  return MockObserver
}

/** Emit on every live observer watching `target`. */
export const emit = (target: Element, isIntersecting: boolean, ratio?: number) =>
  MockObserver.instances.forEach(o => o.emit(target, isIntersecting, ratio))

export const el = (tag = 'div') => document.body.appendChild(document.createElement(tag))
