import { isBrowser } from '@samline/internal'

/** A theme name, or `'system'` to follow the operating system. */
export type ThemeMode = string

export interface ThemeState {
  /** What was chosen: a theme name or `'system'`. */
  mode: ThemeMode
  /** The theme in effect: `'system'` resolved to `'light'` or `'dark'`. */
  theme: string
}

export interface ThemeOptions {
  /** Themes that can be chosen, besides `'system'`. Defaults to `['light', 'dark']`. */
  themes?: string[]
  /** Mode used when nothing is stored. Defaults to `'system'`. */
  defaultMode?: ThemeMode
  /**
   * How the theme is written on the target: an attribute name (`'data-theme'`)
   * or `'class'` to add the theme as a class. Defaults to `'data-theme'`.
   */
  attribute?: string
  /**
   * Element that receives the theme, for themed widgets or previews: an
   * element or a selector. Defaults to `<html>`.
   */
  target?: Element | string
  /**
   * Browser UI color per theme, written to `<meta name="theme-color">`, for
   * example `{ light: '#ffffff', dark: '#111111' }`.
   */
  themeColor?: Record<string, string>
  /** localStorage key, or `false` to not remember the choice. Defaults to `'theme'`. */
  storageKey?: string | false
  /** Set `color-scheme` on the target for light and dark, so native controls follow. Defaults to `true`. */
  colorScheme?: boolean
  /** Turn CSS transitions off while switching, so the page does not animate. Defaults to `true`. */
  disableTransitions?: boolean
  /**
   * Handle `[data-theme-set]`, `[data-theme-toggle]` and `select[data-theme-select]`
   * controls. Defaults to `true`.
   */
  controls?: boolean
  /** Where controls are looked for. Defaults to `document`. */
  scope?: ParentNode
  /** Called whenever the mode or the resolved theme changes. */
  onChange?: (state: ThemeState) => void
}

export interface Theme {
  /** What was chosen: a theme name or `'system'`. */
  readonly mode: ThemeMode
  /** The theme in effect. */
  readonly theme: string
  /** Choose a theme name or `'system'`. Unknown names are ignored. */
  set: (mode: ThemeMode) => void
  /** Switch between light and dark, from the theme in effect. */
  toggle: () => void
  /** Listen to changes. Returns an unsubscribe function. */
  subscribe: (listener: (state: ThemeState) => void) => () => void
  /** Stop listening to the system, other tabs and controls. The theme stays applied. */
  destroy: () => void
}

export const SYSTEM = 'system'
export const EVENT = 'themechange'
const DARK_QUERY = '(prefers-color-scheme: dark)'
const SETTERS = '[data-theme-set]'
const TOGGLES = '[data-theme-toggle]'
const SELECTS = 'select[data-theme-select]'

const defaults = {
  themes: ['light', 'dark'],
  defaultMode: SYSTEM,
  attribute: 'data-theme',
  storageKey: 'theme' as string | false,
}

const readStored = (key: string | false): string | null => {
  if (!key) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

const writeStored = (key: string | false, value: string) => {
  if (!key) return
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
}

/** `'auto'` (older markup) means `'system'`; anything unknown is `null`. */
const normalize = (value: string | null | undefined, themes: string[]): ThemeMode | null => {
  if (!value) return null
  const mode = value === 'auto' ? SYSTEM : value
  return mode === SYSTEM || themes.includes(mode) ? mode : null
}

const prefersDark = () =>
  typeof window.matchMedia === 'function' && window.matchMedia(DARK_QUERY).matches

/** Turn transitions off; the returned function restores them once the change is styled. */
const suppressTransitions = () => {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  return () => {
    // Style the new theme while transitions are off, then let them run again.
    void window.getComputedStyle(document.body ?? document.documentElement).opacity
    setTimeout(() => style.remove(), 1)
  }
}

/**
 * Manage the page theme: read the stored choice, resolve `'system'` from the
 * operating system, write it on `<html>` (or `target`), remember changes, and
 * follow the system and other tabs. Controls with `data-theme-set`,
 * `data-theme-toggle` or `data-theme-select` work anywhere in `scope`.
 */
export function createTheme(options: ThemeOptions = {}): Theme {
  const themes = options.themes?.length ? options.themes : defaults.themes
  const attribute = options.attribute ?? defaults.attribute
  const storageKey = options.storageKey === undefined ? defaults.storageKey : options.storageKey
  const fallback = normalize(options.defaultMode, themes) ?? defaults.defaultMode
  const colorScheme = options.colorScheme ?? true
  const listeners = new Set<(state: ThemeState) => void>()
  if (options.onChange) listeners.add(options.onChange)

  const resolve = (mode: ThemeMode) => (mode === SYSTEM ? (prefersDark() ? 'dark' : 'light') : mode)

  if (!isBrowser()) {
    const theme = resolve(fallback)
    return {
      mode: fallback,
      theme,
      set: () => {},
      toggle: () => {},
      subscribe: () => () => {},
      destroy: () => {},
    }
  }

  const root =
    (typeof options.target === 'string'
      ? document.querySelector(options.target)
      : options.target) ?? document.documentElement
  const scope: ParentNode = options.scope ?? document
  const listenOn = scope as unknown as Document
  let mode: ThemeMode = normalize(readStored(storageKey), themes) ?? fallback
  let theme = ''

  const write = (next: string) => {
    if (attribute === 'class') {
      root.classList.remove(...themes.filter(name => name !== next))
      root.classList.add(next)
    } else {
      root.setAttribute(attribute, next)
    }
    const style = (root as HTMLElement).style
    if (colorScheme && style) {
      if (next === 'light' || next === 'dark') style.colorScheme = next
      else style.removeProperty('color-scheme')
    }
    const color = options.themeColor?.[next]
    if (color) {
      let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'theme-color'
        document.head.appendChild(meta)
      }
      meta.content = color
    }
  }

  const syncControls = () => {
    if (options.controls === false) return
    scope.querySelectorAll<HTMLElement>(SETTERS).forEach(control => {
      const on = normalize(control.getAttribute('data-theme-set'), themes) === mode
      if (control instanceof HTMLInputElement) control.checked = on
      else control.setAttribute('aria-pressed', String(on))
    })
    scope.querySelectorAll<HTMLElement>(TOGGLES).forEach(control => {
      control.setAttribute('aria-pressed', String(theme === 'dark'))
    })
    scope.querySelectorAll<HTMLSelectElement>(SELECTS).forEach(select => {
      select.value = mode
    })
  }

  /** Apply `next`; `animate` is false on the first paint. */
  const apply = (nextMode: ThemeMode, animate: boolean) => {
    const nextTheme = resolve(nextMode)
    const changed = nextMode !== mode || nextTheme !== theme
    mode = nextMode
    if (nextTheme !== theme) {
      const restore = animate && options.disableTransitions !== false ? suppressTransitions() : null
      theme = nextTheme
      write(theme)
      restore?.()
    }
    syncControls()
    if (!changed || !animate) return
    const state = { mode, theme }
    listeners.forEach(listener => listener(state))
    root.dispatchEvent(new CustomEvent(EVENT, { detail: state, bubbles: true }))
  }

  const set = (next: ThemeMode) => {
    const valid = normalize(next, themes)
    if (!valid) return
    writeStored(storageKey, valid)
    apply(valid, true)
  }

  const toggle = () => set(theme === 'dark' ? 'light' : 'dark')

  // The system preference only matters while following it.
  const query = typeof window.matchMedia === 'function' ? window.matchMedia(DARK_QUERY) : null
  const onSystem = () => {
    if (mode === SYSTEM) apply(SYSTEM, true)
  }
  // Another tab changed the choice.
  const onStorage = (event: StorageEvent) => {
    if (!storageKey || event.key !== storageKey) return
    apply(normalize(event.newValue, themes) ?? fallback, true)
  }
  const onClick = (event: Event) => {
    const target = event.target as Element | null
    const toggleControl = target?.closest?.(TOGGLES)
    if (toggleControl) return toggle()
    const setter = target?.closest?.(SETTERS)
    if (setter && !(setter instanceof HTMLInputElement)) set(setter.getAttribute('data-theme-set')!)
  }
  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement | HTMLSelectElement
    if (target.matches?.(SELECTS)) set(target.value)
    else if (target.matches?.(`input${SETTERS}`) && (target as HTMLInputElement).checked) {
      set(target.getAttribute('data-theme-set')!)
    }
  }
  const onReady = () => syncControls()

  apply(mode, false)

  query?.addEventListener('change', onSystem)
  window.addEventListener('storage', onStorage)
  if (options.controls !== false) {
    listenOn.addEventListener('click', onClick)
    listenOn.addEventListener('change', onInput)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady, { once: true })
    }
  }

  return {
    get mode() {
      return mode
    },
    get theme() {
      return theme
    },
    set,
    toggle,
    subscribe: listener => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    destroy: () => {
      query?.removeEventListener('change', onSystem)
      window.removeEventListener('storage', onStorage)
      listenOn.removeEventListener('click', onClick)
      listenOn.removeEventListener('change', onInput)
      document.removeEventListener('DOMContentLoaded', onReady)
      listeners.clear()
    },
  }
}

/**
 * A small inline script for `<head>` that applies the stored theme before
 * the page paints, so a dark page never flashes light. Pass the same
 * `themes`, `defaultMode`, `attribute`, `storageKey`, `colorScheme` and
 * `themeColor` you give `createTheme`. It always writes on `<html>`.
 */
export function themeScript(
  options: Pick<
    ThemeOptions,
    'themes' | 'defaultMode' | 'attribute' | 'storageKey' | 'colorScheme' | 'themeColor'
  > = {}
): string {
  const config = {
    t: options.themes?.length ? options.themes : defaults.themes,
    d: options.defaultMode ?? defaults.defaultMode,
    a: options.attribute ?? defaults.attribute,
    k: options.storageKey === undefined ? defaults.storageKey : options.storageKey,
    c: options.colorScheme ?? true,
    m: options.themeColor ?? {},
  }
  return `(function(o){var m=null,r=document.documentElement;try{m=o.k&&localStorage.getItem(o.k)}catch(e){}if(m==="auto")m="system";if(m!=="system"&&o.t.indexOf(m)<0)m=o.d==="auto"?"system":o.d;var t=m==="system"?(window.matchMedia&&matchMedia("${DARK_QUERY}").matches?"dark":"light"):m;if(o.a==="class")r.classList.add(t);else r.setAttribute(o.a,t);if(o.c&&(t==="light"||t==="dark"))r.style.colorScheme=t;if(o.m[t]){var e=document.querySelector('meta[name="theme-color"]');if(!e){e=document.createElement("meta");e.name="theme-color";document.head.appendChild(e)}e.content=o.m[t]}})(${JSON.stringify(config).replace(/</g, '\\u003c')})`
}
