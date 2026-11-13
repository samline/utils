import { autoHorizontalScroll, horizontalScroll } from '../core/horizontal-scroll.js'
import type { AutoInitController } from '../core/horizontal-scroll.js'

/**
 * Classic script for pages without a build step. It watches every
 * `[data-horizontal-scroll]` section as soon as the DOM is ready, including
 * sections added later. Add `data-manual` to the script tag to start it yourself with
 * `HorizontalScroll.auto()`; calling `HorizontalScroll.auto()` before the DOM is ready also
 * replaces the automatic start.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

let controller: AutoInitController | null = null

const api = {
  horizontalScroll,
  autoHorizontalScroll,
  /** Start (or restart) automatic watching. Returns the controller. */
  auto: (options?: Parameters<typeof autoHorizontalScroll>[0]) => {
    controller?.destroy()
    controller = autoHorizontalScroll(options)
    return controller
  },
  /** The controller of the automatic run, or `null`. */
  get controller() {
    return controller
  },
}

export type HorizontalScrollGlobal = typeof api

const scope = globalThis as typeof globalThis & { HorizontalScroll?: HorizontalScrollGlobal }
scope.HorizontalScroll = api

if (!manual && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    // A page script may already have started it with its own options.
    document.addEventListener('DOMContentLoaded', () => controller ?? api.auto(), { once: true })
  } else {
    api.auto()
  }
}

export { autoHorizontalScroll, horizontalScroll }
