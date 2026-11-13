import { createTheme, themeScript } from '../core/theme.js'
import type { Theme, ThemeOptions } from '../core/theme.js'

/**
 * Classic script for pages without a build step. Load it in `<head>` without
 * `defer` and it applies the stored theme before the page paints, then
 * handles theme controls. Options come from the script tag:
 * `data-themes="light dark sepia"`, `data-default`, `data-attribute` and
 * `data-storage-key` (`"false"` to not remember). Add `data-manual` to start
 * it yourself with `Theme.auto(options)`.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

const fromScript = (): ThemeOptions => {
  if (!script) return {}
  const data = (script as HTMLElement).dataset
  const options: ThemeOptions = {}
  if (data.themes) options.themes = data.themes.split(/[\s,]+/).filter(Boolean)
  if (data.default) options.defaultMode = data.default
  if (data.attribute) options.attribute = data.attribute
  if (data.storageKey) options.storageKey = data.storageKey === 'false' ? false : data.storageKey
  return options
}

let controller: Theme | null = null

const api = {
  createTheme,
  themeScript,
  /** Start (or restart) with options. Returns the controller. */
  auto: (options?: ThemeOptions) => {
    controller?.destroy()
    controller = createTheme({ ...fromScript(), ...options })
    return controller
  },
  /** The running controller, or `null`. */
  get controller() {
    return controller
  },
  /** Shortcuts to the running controller. */
  set: (mode: string) => controller?.set(mode),
  toggle: () => controller?.toggle(),
}

export type ThemeGlobal = typeof api

const scope = globalThis as typeof globalThis & { Theme?: ThemeGlobal }
scope.Theme = api

// Apply at once, before the page paints.
if (!manual && typeof document !== 'undefined') api.auto()

export { createTheme, themeScript }
