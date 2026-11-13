import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import defaultExport, { EVENT, createTheme, themeScript, type Theme } from '../src/index.js'
import * as vanilla from '../src/vanilla/index.js'
import { html, installSystem, reset, setSystemDark, systemListeners } from './helpers.js'

const running: Theme[] = []
const create = (...args: Parameters<typeof createTheme>) => {
  const theme = createTheme(...args)
  running.push(theme)
  return theme
}

beforeEach(() => {
  reset()
  installSystem(false)
})

afterEach(() => {
  running.splice(0).forEach(theme => theme.destroy())
  vi.useRealTimers()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('applying', () => {
  it('follows the system by default and writes data-theme and color-scheme', () => {
    installSystem(true)
    const theme = create()
    expect(theme.mode).toBe('system')
    expect(theme.theme).toBe('dark')
    expect(html.getAttribute('data-theme')).toBe('dark')
    expect(html.style.colorScheme).toBe('dark')
  })

  it('uses the stored choice, and treats auto as system', () => {
    localStorage.setItem('theme', 'dark')
    expect(create().theme).toBe('dark')

    localStorage.setItem('theme', 'auto')
    expect(create().mode).toBe('system')

    localStorage.setItem('theme', 'nonsense')
    expect(create({ defaultMode: 'dark' }).mode).toBe('dark')
    expect(create({ defaultMode: 'nonsense' }).mode).toBe('system')
  })

  it('writes a class instead, removing the other themes', () => {
    html.classList.add('dark', 'keep')
    const theme = create({ attribute: 'class', defaultMode: 'light' })
    expect([...html.classList].sort()).toEqual(['keep', 'light'])
    theme.set('dark')
    expect([...html.classList].sort()).toEqual(['dark', 'keep'])
  })

  it('supports custom themes and leaves color-scheme to them', () => {
    const theme = create({ themes: ['light', 'dark', 'sepia'], attribute: 'data-mode' })
    theme.set('sepia')
    expect(html.getAttribute('data-mode')).toBe('sepia')
    expect(html.style.colorScheme).toBe('')
    theme.set('unknown')
    expect(theme.mode).toBe('sepia')
  })

  it('can skip color-scheme and storage', () => {
    const theme = create({ colorScheme: false, storageKey: false, defaultMode: 'dark' })
    expect(html.style.colorScheme).toBe('')
    theme.set('light')
    expect(localStorage.length).toBe(0)
  })

  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const theme = create()
    theme.set('dark')
    expect(theme.theme).toBe('dark')
  })

  it('works without matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined)
    expect(create().theme).toBe('light')
  })

  it('is inert without a DOM', () => {
    vi.stubGlobal('window', undefined)
    const theme = createTheme({ defaultMode: 'dark' })
    expect(theme.theme).toBe('dark')
    theme.set('light')
    theme.toggle()
    theme.subscribe(() => {})()
    theme.destroy()
    expect(theme.mode).toBe('dark')
  })
})

describe('changing', () => {
  it('sets, toggles, stores and notifies', () => {
    const onChange = vi.fn()
    const onEvent = vi.fn()
    document.addEventListener(EVENT, onEvent)
    const theme = create({ onChange })
    expect(onChange).not.toHaveBeenCalled()

    theme.set('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    expect(onChange).toHaveBeenLastCalledWith({ mode: 'dark', theme: 'dark' })
    expect(onEvent.mock.calls[0]![0].detail).toEqual({ mode: 'dark', theme: 'dark' })

    theme.toggle()
    expect(theme.theme).toBe('light')
    theme.toggle()
    expect(theme.theme).toBe('dark')

    // Same mode again: nothing to report.
    onChange.mockClear()
    theme.set('dark')
    expect(onChange).not.toHaveBeenCalled()

    // system resolving to the same theme still reports the new mode.
    theme.set('light')
    theme.set('system')
    expect(onChange).toHaveBeenLastCalledWith({ mode: 'system', theme: 'light' })
    document.removeEventListener(EVENT, onEvent)
  })

  it('subscribes and unsubscribes', () => {
    const theme = create()
    const listener = vi.fn()
    const off = theme.subscribe(listener)
    theme.set('dark')
    off()
    theme.set('light')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('follows the system only while in system mode', () => {
    const theme = create()
    setSystemDark(true)
    expect(theme.theme).toBe('dark')
    theme.set('light')
    setSystemDark(false)
    setSystemDark(true)
    expect(theme.theme).toBe('light')
  })

  it('follows other tabs', () => {
    const theme = create()
    const emit = (key: string | null, newValue: string | null) =>
      window.dispatchEvent(new StorageEvent('storage', { key, newValue }))
    emit('theme', 'dark')
    expect(theme.theme).toBe('dark')
    emit('other', 'light')
    expect(theme.theme).toBe('dark')
    emit('theme', null)
    expect(theme.mode).toBe('system')

    const quiet = create({ storageKey: false })
    emit('theme', 'dark')
    expect(quiet.theme).toBe('light')
  })

  it('turns transitions off for the switch', () => {
    vi.useFakeTimers()
    const theme = create()
    theme.set('dark')
    expect(document.head.querySelector('style')?.textContent).toContain('transition:none')
    vi.advanceTimersByTime(5)
    expect(document.head.querySelector('style')).toBeNull()

    const plain = create({ disableTransitions: false })
    plain.set('light')
    expect(document.head.querySelector('style')).toBeNull()
  })

  it('stops listening on destroy, keeping the theme', () => {
    const theme = createTheme({ defaultMode: 'dark' })
    theme.destroy()
    expect(systemListeners()).toBe(0)
    window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }))
    expect(html.getAttribute('data-theme')).toBe('dark')
  })
})

describe('controls', () => {
  const markup = `
    <button id="toggle" data-theme-toggle>Dark mode</button>
    <button id="dark" data-theme-set="dark"><span>Dark</span></button>
    <button id="system" data-theme-set="system">System</button>
    <label><input type="radio" name="t" id="r-light" data-theme-set="light" /> Light</label>
    <label><input type="radio" name="t" id="r-dark" data-theme-set="dark" /> Dark</label>
    <select data-theme-select id="select">
      <option value="system">System</option><option value="light">Light</option><option value="dark">Dark</option>
    </select>`
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T

  it('reflects the state on every control', () => {
    document.body.innerHTML = markup
    const theme = create()
    expect($('toggle').getAttribute('aria-pressed')).toBe('false')
    expect($('system').getAttribute('aria-pressed')).toBe('true')
    expect($<HTMLSelectElement>('select').value).toBe('system')

    theme.set('dark')
    expect($('toggle').getAttribute('aria-pressed')).toBe('true')
    expect($('dark').getAttribute('aria-pressed')).toBe('true')
    expect($('system').getAttribute('aria-pressed')).toBe('false')
    expect($<HTMLInputElement>('r-dark').checked).toBe(true)
    expect($<HTMLSelectElement>('select').value).toBe('dark')
  })

  it('changes the theme from buttons, radios and selects', () => {
    document.body.innerHTML = markup
    const theme = create()
    $('toggle').click()
    expect(theme.theme).toBe('dark')
    $('system').click()
    expect(theme.mode).toBe('system')
    $('dark').querySelector('span')!.click()
    expect(theme.mode).toBe('dark')

    $('r-light').click()
    expect(theme.mode).toBe('light')

    const select = $<HTMLSelectElement>('select')
    select.value = 'system'
    select.dispatchEvent(new Event('change', { bubbles: true }))
    expect(theme.mode).toBe('system')

    // Unrelated clicks and changes are ignored.
    document.body.click()
    document.body.dispatchEvent(new Event('change', { bubbles: true }))
    expect(theme.mode).toBe('system')
  })

  it('syncs controls written after the script, once the DOM is ready', () => {
    const ready = vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading')
    localStorage.setItem('theme', 'dark')
    create()
    document.body.innerHTML = markup
    ready.mockReturnValue('complete')
    document.dispatchEvent(new Event('DOMContentLoaded'))
    expect($('toggle').getAttribute('aria-pressed')).toBe('true')
  })

  it('leaves controls alone with controls: false', () => {
    document.body.innerHTML = markup
    const theme = create({ controls: false })
    $('toggle').click()
    expect(theme.theme).toBe('light')
    expect($('toggle').hasAttribute('aria-pressed')).toBe(false)
  })
})

describe('themeScript', () => {
  const run = (code: string) => new Function(code)()

  it('applies the stored theme before anything else', () => {
    localStorage.setItem('theme', 'dark')
    run(themeScript())
    expect(html.getAttribute('data-theme')).toBe('dark')
    expect(html.style.colorScheme).toBe('dark')
  })

  it('resolves system, auto and unknown values', () => {
    installSystem(true)
    run(themeScript())
    expect(html.getAttribute('data-theme')).toBe('dark')

    reset()
    localStorage.setItem('theme', 'auto')
    installSystem(false)
    run(themeScript())
    expect(html.getAttribute('data-theme')).toBe('light')

    reset()
    localStorage.setItem('theme', 'weird')
    run(themeScript({ defaultMode: 'dark' }))
    expect(html.getAttribute('data-theme')).toBe('dark')

    reset()
    run(themeScript({ defaultMode: 'auto' }))
    expect(html.getAttribute('data-theme')).toBe('light')
  })

  it('matches the options of createTheme', () => {
    localStorage.setItem('scheme', 'sepia')
    run(
      themeScript({
        themes: ['light', 'dark', 'sepia'],
        attribute: 'class',
        storageKey: 'scheme',
        colorScheme: false,
      })
    )
    expect(html.classList.contains('sepia')).toBe(true)
    expect(html.style.colorScheme).toBe('')

    reset()
    localStorage.setItem('theme', 'dark')
    run(themeScript({ storageKey: false }))
    expect(html.getAttribute('data-theme')).toBe('light')
  })

  it('survives blocked storage and escapes its options', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    run(themeScript())
    expect(html.getAttribute('data-theme')).toBe('light')
    expect(themeScript({ themes: ['</script>'] })).not.toContain('</script>')
  })

  it('exports the same function everywhere', () => {
    expect(defaultExport).toBe(createTheme)
    expect(vanilla.default).toBe(createTheme)
  })
})

describe('target, scope and theme color', () => {
  it('themes one element with its own controls', () => {
    document.body.innerHTML = `
      <div id="widget"><button data-theme-toggle id="inner">Dark</button></div>
      <button data-theme-toggle id="outer">Dark</button>`
    const widget = document.getElementById('widget')!
    const onEvent = vi.fn()
    widget.addEventListener(EVENT, onEvent)
    const theme = create({ target: '#widget', scope: widget, storageKey: 'widget-theme' })
    expect(widget.getAttribute('data-theme')).toBe('light')
    expect(html.hasAttribute('data-theme')).toBe(false)

    document.getElementById('outer')!.click()
    expect(theme.theme).toBe('light')
    expect(document.getElementById('outer')!.hasAttribute('aria-pressed')).toBe(false)

    document.getElementById('inner')!.click()
    expect(widget.getAttribute('data-theme')).toBe('dark')
    expect(widget.style.colorScheme).toBe('dark')
    expect(onEvent).toHaveBeenCalledTimes(1)
    expect(localStorage.getItem('widget-theme')).toBe('dark')

    const element = document.createElement('div')
    create({ target: element })
    expect(element.getAttribute('data-theme')).toBe('light')
    create({ target: '#missing', defaultMode: 'dark' })
    expect(html.getAttribute('data-theme')).toBe('dark')
  })

  it('writes the browser UI color, creating the meta tag when needed', () => {
    const themeColor = { light: '#ffffff', dark: '#111111' }
    const theme = create({ themeColor })
    const meta = () => document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    expect(meta()?.content).toBe('#ffffff')
    theme.set('dark')
    expect(meta()?.content).toBe('#111111')
    expect(document.querySelectorAll('meta[name="theme-color"]')).toHaveLength(1)

    // A theme without a color leaves the meta tag alone.
    const custom = create({ themes: ['light', 'dark', 'sepia'], themeColor })
    custom.set('sepia')
    expect(meta()?.content).toBe('#111111')
    meta()?.remove()

    localStorage.setItem('theme', 'dark')
    new Function(themeScript({ themeColor }))()
    expect(meta()?.content).toBe('#111111')
    new Function(themeScript({ themeColor }))()
    expect(document.querySelectorAll('meta[name="theme-color"]')).toHaveLength(1)
    meta()?.remove()
  })
})
