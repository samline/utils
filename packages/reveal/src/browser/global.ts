import { autoReveal, reveal, REVEAL_EFFECTS } from '../core/reveal.js'
import type { AutoInitController } from '../core/reveal.js'

/**
 * Classic script for pages without a build step. It reveals every
 * `[data-reveal]` element as soon as the DOM is ready, including elements
 * added later. Add `data-manual` to the script tag to start it yourself with
 * `Reveal.auto()`; calling `Reveal.auto()` before the DOM is ready also
 * replaces the automatic start.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

let controller: AutoInitController | null = null

const api = {
  reveal,
  autoReveal,
  effects: REVEAL_EFFECTS,
  /** Start (or restart) automatic revealing. Returns the controller. */
  auto: (options?: Parameters<typeof autoReveal>[0]) => {
    controller?.destroy()
    controller = autoReveal(options)
    return controller
  },
  /** The controller of the automatic run, or `null`. */
  get controller() {
    return controller
  },
}

export type RevealGlobal = typeof api

const scope = globalThis as typeof globalThis & { Reveal?: RevealGlobal }
scope.Reveal = api

if (!manual && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    // A page script may already have started it with its own options.
    document.addEventListener('DOMContentLoaded', () => controller ?? api.auto(), { once: true })
  } else {
    api.auto()
  }
}

export { autoReveal, reveal }
