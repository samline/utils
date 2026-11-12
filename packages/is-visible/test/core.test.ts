import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import isVisible, { observeVisibility } from '../src/index.js'
import { countObservers } from '../src/core/pool.js'
import { el, emit, installMock, MockObserver } from './helpers.js'

beforeEach(() => {
  installMock()
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('isVisible', () => {
  it('fires visible once per entry and notVisible only after being visible', () => {
    const target = el()
    const visible = vi.fn()
    const notVisible = vi.fn()
    const stop = isVisible(target, { visible, notVisible, inOut: true })

    emit(target, false)
    expect(notVisible).not.toHaveBeenCalled()

    emit(target, true)
    emit(target, true, 0.8)
    expect(visible).toHaveBeenCalledTimes(1)
    expect(visible.mock.calls[0]![1]).toBe(target)

    emit(target, false)
    expect(notVisible).toHaveBeenCalledTimes(1)

    emit(target, true)
    expect(visible).toHaveBeenCalledTimes(2)
    stop()
  })

  it('does not report leaving without inOut', () => {
    const target = el()
    const notVisible = vi.fn()
    isVisible(target, { notVisible })
    emit(target, true)
    emit(target, false)
    expect(notVisible).not.toHaveBeenCalled()
  })

  it('stops observing an element after the first visible with once', () => {
    const target = el()
    const visible = vi.fn()
    isVisible(target, { visible, once: true })

    emit(target, true)
    emit(target, false)
    emit(target, true)
    expect(visible).toHaveBeenCalledTimes(1)
    expect(countObservers()).toBe(0)
  })

  it('accepts selectors, NodeLists and arrays', () => {
    el('section').className = 'x'
    el('section').className = 'x'
    const visible = vi.fn()
    isVisible('.x', { visible })
    document.querySelectorAll('.x').forEach(node => emit(node, true))
    expect(visible).toHaveBeenCalledTimes(2)

    const list = vi.fn()
    isVisible(document.querySelectorAll('.x'), { visible: list })
    expect(MockObserver.instances).toHaveLength(1)
  })

  it('shares one observer per configuration and disconnects when unused', () => {
    const a = el()
    const b = el()
    const stopA = isVisible(a)
    const stopB = isVisible(b)
    const stopA2 = isVisible(a)
    const stopHalf = isVisible(a, { threshold: 0.5 })

    expect(MockObserver.instances).toHaveLength(2)
    expect(countObservers()).toBe(2)

    stopA()
    stopA() // idempotent
    expect(MockObserver.instances[0]!.observed.has(a)).toBe(true)
    stopA2()
    expect(MockObserver.instances[0]!.observed.has(a)).toBe(false)
    stopB()
    stopHalf()
    expect(MockObserver.instances.every(o => o.disconnected)).toBe(true)
    expect(countObservers()).toBe(0)
  })

  it('normalizes options, including the deprecated options object', () => {
    const target = el()
    isVisible(target, { threshold: [0.5, 2, -1, Number.NaN, 0.5], rootMargin: '10px' })
    expect(MockObserver.instances[0]!.options).toMatchObject({
      rootMargin: '10px',
      threshold: [0, 0.5, 1],
      root: null,
    })

    const root = el()
    isVisible(target, { options: { threshold: 0.25, rootMargin: '5px', root } })
    expect(MockObserver.instances[1]!.options).toMatchObject({
      rootMargin: '5px',
      threshold: [0.25],
      root,
    })
    expect(countObservers(root)).toBe(1)

    isVisible(target, { threshold: [] })
    expect(MockObserver.instances[2]!.options.threshold).toEqual([0])
  })

  it('requires the minimum threshold, with a small tolerance', () => {
    const target = el()
    const visible = vi.fn()
    isVisible(target, { visible, threshold: 0.5 })

    emit(target, true, 0.2)
    expect(visible).not.toHaveBeenCalled()
    emit(target, true, 0.4995)
    expect(visible).toHaveBeenCalledTimes(1)
  })

  it('reports raw entries through onChange', () => {
    const target = el()
    const onChange = vi.fn()
    observeVisibility(target, { onChange })
    emit(target, false)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('returns a no-op for missing targets or without a DOM', () => {
    expect(isVisible(null)()).toBeUndefined()
    expect(isVisible('.missing')()).toBeUndefined()
    vi.stubGlobal('window', undefined)
    expect(isVisible(el())()).toBeUndefined()
  })

  it('reports visible once without IntersectionObserver unless disabled', async () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    const target = el()
    const visible = vi.fn()

    isVisible(target, { visible })
    await Promise.resolve()
    expect(visible).toHaveBeenCalledWith(null, target)

    const cancelled = vi.fn()
    isVisible(target, { visible: cancelled })()
    await Promise.resolve()
    expect(cancelled).not.toHaveBeenCalled()

    const none = vi.fn()
    isVisible(target, { visible: none, fallback: 'none' })
    isVisible(target)
    await Promise.resolve()
    expect(none).not.toHaveBeenCalled()
  })
})
