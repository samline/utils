import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import revealDefault, { REVEAL_EFFECTS, autoReveal, reveal } from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import { el, emit, installMock, installMotion, setReducedMotion, state, tick } from './helpers.js'

beforeEach(() => {
  installMock()
  installMotion(false)
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('initial position', () => {
  it('never hides elements that start in view', async () => {
    const node = el()
    const onReveal = vi.fn()
    reveal(node, { onReveal })

    emit(node, 'in')
    await tick()
    expect(state(node)).toBe('revealed')
    expect(onReveal).toHaveBeenCalledWith(node)
  })

  it('hides elements below the fold and reveals them on entry', async () => {
    const node = el()
    const onReveal = vi.fn()
    reveal(node, { onReveal })

    emit(node, 'below')
    expect(state(node)).toBe('pending')
    expect(onReveal).not.toHaveBeenCalled()

    emit(node, 'in')
    await tick()
    expect(state(node)).toBe('revealing')
    expect(onReveal).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(60)
    expect(state(node)).toBe('revealed')
  })

  it('keeps content above the viewport visible unless it repeats', async () => {
    const once = el()
    const repeat = el({ 'data-reveal': '', 'data-reveal-repeat': '' })
    reveal([once, repeat])

    emit(once, 'above')
    emit(repeat, 'above')
    expect(state(once)).toBe('revealed')
    expect(state(repeat)).toBe('pending')
  })

  it('never hides elements without a box (display: none)', () => {
    const node = el()
    reveal(node)
    emit(node, 'hidden')
    expect(state(node)).toBe('revealed')
  })

  it('reads the first entry only once per element', () => {
    const node = el()
    reveal(node)
    emit(node, 'below')
    emit(node, 'above')
    expect(state(node)).toBe('pending')
  })
})

describe('repeat', () => {
  it('hides again on leaving and reveals on every entry', async () => {
    const node = el()
    const onHide = vi.fn()
    const onReveal = vi.fn()
    reveal(node, { repeat: true, onHide, onReveal })

    emit(node, 'below')
    emit(node, 'in')
    await tick()
    vi.advanceTimersByTime(60)
    expect(state(node)).toBe('revealed')

    emit(node, 'below')
    expect(state(node)).toBe('pending')
    expect(onHide).toHaveBeenCalledWith(node)

    emit(node, 'in')
    await tick()
    expect(state(node)).toBe('revealing')
    expect(onReveal).toHaveBeenCalledTimes(2)
  })

  it('stops after the first reveal without repeat', async () => {
    const node = el()
    reveal(node)
    emit(node, 'below')
    emit(node, 'in')
    await tick()
    emit(node, 'below')
    expect(state(node)).toBe('revealing')
  })
})

describe('settings', () => {
  it('sets the effect and restores the attribute on cleanup', () => {
    const missing = document.body.appendChild(document.createElement('div'))
    const invalid = el({ 'data-reveal': 'spin' })
    const valid = el({ 'data-reveal': 'left' })
    const stop = reveal([missing, invalid, valid], { effect: 'zoom' })

    expect(missing.getAttribute('data-reveal')).toBe('zoom')
    expect(invalid.getAttribute('data-reveal')).toBe('zoom')
    expect(valid.getAttribute('data-reveal')).toBe('left')

    stop()
    expect(missing.hasAttribute('data-reveal')).toBe(false)
    expect(invalid.getAttribute('data-reveal')).toBe('spin')
    expect(valid.getAttribute('data-reveal')).toBe('left')
  })

  it('defaults the effect to up', () => {
    const node = el()
    reveal(node)
    expect(node.getAttribute('data-reveal')).toBe('up')
  })

  it('maps attributes and options to custom properties, attributes first', () => {
    const node = el({
      'data-reveal': '',
      'data-reveal-duration': '900',
      'data-reveal-distance': '2rem',
    })
    node.style.setProperty('--reveal-delay', '40ms')
    const stop = reveal(node, { duration: 300, delay: 120 })

    expect(node.style.getPropertyValue('--reveal-duration')).toBe('900ms')
    expect(node.style.getPropertyValue('--reveal-delay')).toBe('120ms')
    expect(node.style.getPropertyValue('--reveal-distance')).toBe('2rem')

    stop()
    expect(node.style.getPropertyValue('--reveal-duration')).toBe('')
    expect(node.style.getPropertyValue('--reveal-delay')).toBe('40ms')
    expect(node.style.getPropertyValue('--reveal-distance')).toBe('')
  })

  it('exposes the effect list', () => {
    expect(REVEAL_EFFECTS).toEqual(['up', 'down', 'left', 'right', 'fade', 'zoom', 'blur'])
    expect(revealDefault).toBe(reveal)
    expect(vanilla.default).toBe(reveal)
  })
})

describe('stagger', () => {
  it('cascades elements of the same container that enter together', async () => {
    const list = document.body.appendChild(document.createElement('ul'))
    list.setAttribute('data-reveal-stagger', '100')
    const items = [el(undefined, list), el(undefined, list), el(undefined, list)]
    items[2]!.setAttribute('data-reveal-delay', '50')
    reveal(items)

    items.forEach(item => emit(item, 'below'))
    // Entries arrive out of order; the cascade follows document order.
    ;[items[2]!, items[0]!, items[1]!].forEach(item => emit(item, 'in'))
    await tick()

    expect(items.map(item => item.style.getPropertyValue('--reveal-delay'))).toEqual([
      '',
      '100ms',
      '250ms',
    ])
    expect(items.every(item => state(item) === 'revealing')).toBe(true)
  })

  it('uses the option when there is no container and adds the CSS delay', async () => {
    const a = el()
    const b = el()
    b.style.setProperty('--reveal-delay', '0.2s')
    reveal([a, b], { stagger: 80 })

    emit(a, 'below')
    emit(b, 'below')
    emit(a, 'in')
    emit(b, 'in')
    await tick()
    expect(b.style.getPropertyValue('--reveal-delay')).toBe('280ms')
  })

  it('does not cascade elements that enter in different frames', async () => {
    const a = el()
    const b = el()
    reveal([a, b], { stagger: 80 })
    emit(a, 'below')
    emit(b, 'below')

    emit(a, 'in')
    await tick()
    emit(b, 'in')
    await tick()
    expect(b.style.getPropertyValue('--reveal-delay')).toBe('')
  })
})

describe('reduced motion', () => {
  it('never hides anything when motion is reduced', () => {
    installMotion(true)
    const node = el()
    const onReveal = vi.fn()
    reveal(node, { onReveal, repeat: true })
    emit(node, 'below')
    expect(state(node)).toBe('revealed')
    expect(onReveal).toHaveBeenCalledTimes(1)

    emit(node, 'in')
    emit(node, 'below')
    expect(state(node)).toBe('revealed')
  })

  it('shows hidden elements at once when the preference turns on', () => {
    const node = el()
    reveal(node, { repeat: true })
    emit(node, 'below')
    expect(state(node)).toBe('pending')

    setReducedMotion(true)
    expect(state(node)).toBe('revealed')

    emit(node, 'in')
    emit(node, 'below')
    expect(state(node)).toBe('revealed')
  })
})

describe('lifecycle', () => {
  it('leaves scrub elements to CSS', () => {
    const node = el({ 'data-reveal': '', 'data-reveal-scrub': '' })
    expect(reveal(node)).toBeTypeOf('function')
    emit(node, 'below')
    expect(state(node)).toBeNull()
  })

  it('returns a no-op without elements or without a DOM', () => {
    expect(() => reveal('.missing')()).not.toThrow()
    vi.stubGlobal('window', undefined)
    expect(() => reveal('[data-reveal]')()).not.toThrow()
  })

  it('reveals [data-reveal] by default', () => {
    const node = el()
    reveal()
    emit(node, 'below')
    expect(state(node)).toBe('pending')
  })

  it('cleans up state, timers and observers', async () => {
    const node = el()
    const onReveal = vi.fn()
    const stop = reveal(node, { onReveal })
    emit(node, 'below')
    emit(node, 'in')
    await tick()
    stop()
    stop()

    expect(state(node)).toBeNull()
    vi.advanceTimersByTime(100)
    expect(state(node)).toBeNull()
    emit(node, 'below')
    expect(state(node)).toBeNull()
  })

  it('does not reveal after cleanup when the cascade was already queued', async () => {
    const node = el()
    const stop = reveal(node)
    emit(node, 'below')
    emit(node, 'in')
    stop()
    await tick()
    expect(state(node)).toBeNull()
  })
})

describe('autoReveal', () => {
  it('reveals matching elements, including ones added and removed later', async () => {
    // MutationObserver records are delivered as microtasks; real timers let them run.
    vi.useRealTimers()
    const settle = () => new Promise(resolve => setTimeout(resolve, 0))
    const first = el()
    const controller = autoReveal({ selector: '[data-reveal]', stagger: 0 })
    emit(first, 'below')
    expect(state(first)).toBe('pending')

    const later = el()
    await settle()
    emit(later, 'below')
    expect(state(later)).toBe('pending')

    later.remove()
    await settle()
    expect(state(later)).toBeNull()

    controller.destroy()
    expect(state(first)).toBeNull()
  })

  it('can be limited to a scope', () => {
    const section = document.body.appendChild(document.createElement('section'))
    const inside = el(undefined, section)
    const outside = el()
    const controller = autoReveal({ scope: section, observe: false })
    emit(inside, 'below')
    emit(outside, 'below')
    expect(state(inside)).toBe('pending')
    expect(state(outside)).toBeNull()
    controller.destroy()
  })
})
