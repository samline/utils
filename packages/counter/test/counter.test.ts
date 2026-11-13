import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import counterDefault, {
  animateNumber,
  type Easing,
  autoCounter,
  counter,
  parseNumber,
} from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import { el, emit, installMock, installMotion, setReducedMotion, state } from './helpers.js'

beforeEach(() => {
  installMock()
  installMotion(false)
  vi.useFakeTimers({
    toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'setTimeout'],
  })
})

afterEach(() => {
  document.body.innerHTML = ''
  document.documentElement.removeAttribute('lang')
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

/** Run frames for `ms` milliseconds. */
const run = (ms: number) => vi.advanceTimersByTime(ms)

describe('animateNumber', () => {
  it('eases from one value to another and ends exactly on the target', () => {
    const values: number[] = []
    const onComplete = vi.fn()
    animateNumber({ from: 10, to: 20, duration: 1000, onUpdate: v => values.push(v), onComplete })

    run(500)
    const middle = values.slice(-1)[0]!
    // ease-out is past the linear midpoint halfway through.
    expect(middle).toBeGreaterThan(15)
    expect(middle).toBeLessThan(20)
    expect(onComplete).not.toHaveBeenCalled()

    run(600)
    expect(values.slice(-1)[0]).toBe(20)
    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('supports linear, ease-in-out and custom easings', () => {
    const at = (easing: Easing) => {
      let last = 0
      const cancel = animateNumber({ to: 100, duration: 1000, easing, onUpdate: v => (last = v) })
      // Frames run every 16ms from 16ms: the last one at 512ms is ~half way.
      run(516)
      cancel()
      return last
    }
    // Progress is 0.496 at that frame.
    expect(at('linear')).toBeCloseTo(49.6, 5)
    expect(at('ease-in-out')).toBeCloseTo(4 * 0.496 ** 3 * 100, 5)
    expect(at(t => t * t)).toBeCloseTo(0.496 ** 2 * 100, 5)
    // Unknown names fall back to ease-out.
    expect(at('bounce' as never)).toBeGreaterThan(80)
  })

  it('waits for the delay, showing the start value', () => {
    const values: number[] = []
    animateNumber({ from: 5, to: 10, duration: 100, delay: 200, onUpdate: v => values.push(v) })
    run(150)
    expect(new Set(values)).toEqual(new Set([5]))
    run(400)
    expect(values.slice(-1)[0]).toBe(10)
  })

  it('can be cancelled', () => {
    const onUpdate = vi.fn()
    const onComplete = vi.fn()
    const cancel = animateNumber({ to: 1, duration: 100, onUpdate, onComplete })
    cancel()
    run(500)
    expect(onUpdate).not.toHaveBeenCalled()
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('jumps to the end with no duration or no animation frames', () => {
    const onUpdate = vi.fn()
    animateNumber({ to: 3, duration: 0, onUpdate })
    expect(onUpdate).toHaveBeenCalledWith(3)

    vi.stubGlobal('requestAnimationFrame', undefined)
    const onComplete = vi.fn()
    animateNumber({ to: 4, onUpdate, onComplete })
    expect(onUpdate).toHaveBeenLastCalledWith(4)
    expect(onComplete).toHaveBeenCalled()
  })
})

describe('parseNumber', () => {
  it('reads numbers written for people in a locale', () => {
    expect(parseNumber('1,234.5', 'en')).toEqual({ value: 1234.5, decimals: 1 })
    expect(parseNumber('1.234,50 €', 'de')).toEqual({ value: 1234.5, decimals: 2 })
    expect(parseNumber('−12 %', 'en')).toEqual({ value: -12, decimals: 0 })
    expect(parseNumber('+2 500', 'fr')).toEqual({ value: 2500, decimals: 0 })
    expect(parseNumber('n/a')).toBeNull()
  })
})

describe('counter', () => {
  it('shows the start value, then counts to the final value once visible', () => {
    const node = el({ 'data-counter': '1234' }, '1,234')
    const onStart = vi.fn()
    const onUpdate = vi.fn()
    const onComplete = vi.fn()
    counter(node, { locale: 'en', duration: 1000, onStart, onUpdate, onComplete })

    expect(node.textContent).toBe('0')
    expect(state(node)).toBe('pending')

    emit(node, 'in')
    expect(state(node)).toBe('counting')
    expect(onStart).toHaveBeenCalledWith(node)
    run(500)
    expect(Number(node.textContent!.replace(/,/g, ''))).toBeGreaterThan(617)
    expect(onUpdate).toHaveBeenCalled()

    run(600)
    expect(node.textContent).toBe('1,234')
    expect(state(node)).toBe('done')
    expect(onComplete).toHaveBeenCalledWith(node)
  })

  it('reads the final value from the text in the closest language', () => {
    document.documentElement.setAttribute('lang', 'de')
    const node = el({ 'data-counter': '' }, '1.234,5')
    counter(node, { duration: 100 })
    expect(node.textContent).toBe('0,0')
    emit(node, 'in')
    run(200)
    expect(node.textContent).toBe('1.234,5')
  })

  it('prefers the attribute, then the option, then the text', () => {
    const attribute = el({ 'data-counter': '7' }, '99')
    const option = el({ 'data-counter': '' }, '99')
    counter([attribute, option], { to: 42, duration: 0, locale: 'en' })
    emit(attribute, 'in')
    emit(option, 'in')
    expect(attribute.textContent).toBe('7')
    expect(option.textContent).toBe('42')
  })

  it('keeps decimals from the target and maps attributes to settings', () => {
    const node = el({
      'data-counter': '12.50',
      'data-counter-from': '10',
      'data-counter-duration': '400',
      'data-counter-delay': '100',
      'data-counter-easing': 'linear',
    })
    counter(node, { locale: 'en', easing: t => t ** 4 })
    expect(node.textContent).toBe('10.00')
    emit(node, 'in')
    run(300)
    // Linear from the attribute wins over the option (t ** 4 would still be near 10).
    expect(Number(node.textContent)).toBeGreaterThan(11)
    expect(Number(node.textContent)).toBeLessThan(11.5)
    run(300)
    expect(node.textContent).toBe('12.50')
  })

  it('formats with decimals, Intl options or a formatter', () => {
    const decimals = el({ 'data-counter': '3', 'data-counter-decimals': '1' })
    const percent = el({ 'data-counter': '0.25' })
    const custom = el({ 'data-counter': '5' })
    counter(decimals, { locale: 'en', duration: 0 })
    counter(percent, { locale: 'en', duration: 0, format: { style: 'percent' } })
    counter(custom, { duration: 0, formatter: value => `${Math.round(value)} items` })
    ;[decimals, percent, custom].forEach(node => emit(node, 'in'))
    expect(decimals.textContent).toBe('3.0')
    expect(percent.textContent).toBe('25%')
    expect(custom.textContent).toBe('5 items')
  })

  it('never shows -0 and ignores invalid locales', () => {
    const node = el({ 'data-counter': '0', 'data-counter-from': '-0.4' })
    counter(node, { locale: 'not a locale', duration: 0 })
    expect(node.textContent).toBe('0')
  })

  it('skips elements without a number and works without a DOM', () => {
    const node = el({ 'data-counter': '' }, 'soon')
    expect(counter(node)).toBeTypeOf('function')
    expect(state(node)).toBeNull()
    expect(node.textContent).toBe('soon')
    expect(() => counter('.missing')()).not.toThrow()

    vi.stubGlobal('window', undefined)
    expect(() => counter()()).not.toThrow()
  })

  it('counts [data-counter] by default and exposes the default export', () => {
    const node = el()
    counter()
    expect(node.textContent).toBe('0')
    expect(counterDefault).toBe(counter)
    expect(vanilla.default).toBe(counter)
  })
})

describe('repeat', () => {
  it('resets on leaving and counts again on every entry', () => {
    const node = el({ 'data-counter': '10', 'data-counter-repeat': '' })
    const onStart = vi.fn()
    counter(node, { duration: 100, onStart })

    emit(node, 'in')
    run(50)
    emit(node, 'below')
    expect(node.textContent).toBe('0')
    expect(state(node)).toBe('pending')
    run(200)
    expect(node.textContent).toBe('0')

    emit(node, 'in')
    run(200)
    expect(node.textContent).toBe('10')
    expect(onStart).toHaveBeenCalledTimes(2)
  })

  it('counts once without repeat', () => {
    const node = el({ 'data-counter': '10' })
    counter(node, { duration: 0 })
    emit(node, 'in')
    emit(node, 'below')
    expect(node.textContent).toBe('10')
  })
})

describe('reduced motion', () => {
  it('keeps the rendered value and never animates', () => {
    installMotion(true)
    const node = el({ 'data-counter': '1234' }, '1,234')
    const onComplete = vi.fn()
    counter(node, { onComplete, repeat: true })
    expect(node.textContent).toBe('1,234')
    expect(state(node)).toBe('done')
    expect(onComplete).toHaveBeenCalledWith(node)
  })

  it('jumps to the final value when the preference turns on', () => {
    const counting = el({ 'data-counter': '50' })
    const waiting = el({ 'data-counter': '70', 'data-counter-repeat': '' })
    counter([counting, waiting], { duration: 1000 })
    emit(counting, 'in')
    run(100)

    setReducedMotion(true)
    expect(counting.textContent).toBe('50')
    expect(waiting.textContent).toBe('70')
    expect(state(counting)).toBe('done')

    // Leaving no longer resets, and entering shows the end at once.
    emit(waiting, 'in')
    emit(waiting, 'below')
    expect(waiting.textContent).toBe('70')
  })
})

describe('lifecycle', () => {
  it('restores the original text and stops on cleanup', () => {
    const node = el({ 'data-counter': '100' }, '100')
    const stop = counter(node, { duration: 1000 })
    emit(node, 'in')
    run(100)
    stop()
    stop()
    expect(node.textContent).toBe('100')
    expect(state(node)).toBeNull()
    run(2000)
    expect(node.textContent).toBe('100')
  })

  it('autoCounter counts matching elements, including later ones', async () => {
    vi.useRealTimers()
    const settle = () => new Promise(resolve => setTimeout(resolve, 0))
    const first = el()
    const controller = autoCounter({ duration: 0 })
    expect(first.textContent).toBe('0')

    const later = el({ 'data-counter': '5' }, '5')
    await settle()
    expect(later.textContent).toBe('0')
    later.remove()
    await settle()
    expect(later.textContent).toBe('5')

    controller.destroy()
    expect(state(first)).toBeNull()
  })

  it('autoCounter can be limited to a scope', () => {
    const section = document.body.appendChild(document.createElement('section'))
    const inside = el(undefined, '', section)
    const outside = el()
    const controller = autoCounter({ scope: section, observe: false })
    expect(state(inside)).toBe('pending')
    expect(state(outside)).toBeNull()
    controller.destroy()
  })
})
