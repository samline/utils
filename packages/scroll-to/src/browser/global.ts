import { autoScrollTo, cancelScroll, scrollPosition, scrollTo } from '../core/scroll-to.js'
import type { ScrollToController } from '../core/scroll-to.js'

/**
 * Classic script for pages without a build step. It handles clicks on
 * `[data-scroll-to]` and same-page `#id` links as soon as the DOM is ready.
 * Add `data-manual` to the script tag to start it yourself with
 * `ScrollTo.auto()`; calling `ScrollTo.auto()` before the DOM is ready also
 * replaces the automatic start.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

let controller: ScrollToController | null = null

const api = {
  scrollTo,
  scrollPosition,
  cancelScroll,
  autoScrollTo,
  /** Start (or restart) handling clicks. Returns the controller. */
  auto: (options?: Parameters<typeof autoScrollTo>[0]) => {
    controller?.destroy()
    controller = autoScrollTo(options)
    return controller
  },
  /** The controller of the automatic run, or `null`. */
  get controller() {
    return controller
  },
}

export type ScrollToGlobal = typeof api

const scope = globalThis as typeof globalThis & { ScrollTo?: ScrollToGlobal }
scope.ScrollTo = api

if (!manual && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    // A page script may already have started it with its own options.
    document.addEventListener('DOMContentLoaded', () => controller ?? api.auto(), { once: true })
  } else {
    api.auto()
  }
}

export { autoScrollTo, cancelScroll, scrollPosition, scrollTo }
