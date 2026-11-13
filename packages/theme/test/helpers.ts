import { vi } from 'vitest'

type Listener = (event: { matches: boolean }) => void

let dark = false
const listeners = new Set<Listener>()

/** A controllable `prefers-color-scheme: dark` media query. */
export const installSystem = (initial = false) => {
  dark = initial
  listeners.clear()
  vi.stubGlobal('matchMedia', (query: string) => ({
    get matches() {
      return query.includes('dark') ? dark : false
    },
    media: query,
    addEventListener: (_: string, fn: Listener) => listeners.add(fn),
    removeEventListener: (_: string, fn: Listener) => listeners.delete(fn),
  }))
}

export const setSystemDark = (value: boolean) => {
  dark = value
  listeners.forEach(fn => fn({ matches: value }))
}

export const systemListeners = () => listeners.size

export const html = document.documentElement

export const reset = () => {
  localStorage.clear()
  html.removeAttribute('data-theme')
  html.removeAttribute('data-mode')
  html.removeAttribute('style')
  html.className = ''
  document.head.querySelectorAll('style').forEach(style => style.remove())
  document.body.innerHTML = ''
}
