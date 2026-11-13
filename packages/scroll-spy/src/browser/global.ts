import { autoScrollSpy, scrollSpy } from '../core/scroll-spy.js'
import type { AutoInitController } from '../core/scroll-spy.js'

/**
 * Classic script for pages without a build step. It watches every
 * `[data-scroll-spy]` navigation as soon as the DOM is ready, including
 * navigations added later. Add `data-manual` to the script tag to start it yourself with
 * `ScrollSpy.auto()`; calling `ScrollSpy.auto()` before the DOM is ready also
 * replaces the automatic start.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

let controller: AutoInitController | null = null

const api = {
  scrollSpy,
  autoScrollSpy,
  /** Start (or restart) automatic watching. Returns the controller. */
  auto: (options?: Parameters<typeof autoScrollSpy>[0]) => {
    controller?.destroy()
    controller = autoScrollSpy(options)
    return controller
  },
  /** The controller of the automatic run, or `null`. */
  get controller() {
    return controller
  },
}

export type ScrollSpyGlobal = typeof api

const scope = globalThis as typeof globalThis & { ScrollSpy?: ScrollSpyGlobal }
scope.ScrollSpy = api

if (!manual && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    // A page script may already have started it with its own options.
    document.addEventListener('DOMContentLoaded', () => controller ?? api.auto(), { once: true })
  } else {
    api.auto()
  }
}

export { autoScrollSpy, scrollSpy }
