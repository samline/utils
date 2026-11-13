import { animateNumber, autoCounter, counter } from '../core/counter.js'
import type { AutoInitController } from '../core/counter.js'

/**
 * Classic script for pages without a build step. It counts every
 * `[data-counter]` element as soon as the DOM is ready, including elements
 * added later. Add `data-manual` to the script tag to start it yourself with
 * `Counter.auto()`; calling `Counter.auto()` before the DOM is ready also
 * replaces the automatic start.
 */
const script = typeof document !== 'undefined' ? document.currentScript : null
const manual = script?.hasAttribute('data-manual') ?? false

let controller: AutoInitController | null = null

const api = {
  counter,
  autoCounter,
  animateNumber,
  /** Start (or restart) automatic counting. Returns the controller. */
  auto: (options?: Parameters<typeof autoCounter>[0]) => {
    controller?.destroy()
    controller = autoCounter(options)
    return controller
  },
  /** The controller of the automatic run, or `null`. */
  get controller() {
    return controller
  },
}

export type CounterGlobal = typeof api

const scope = globalThis as typeof globalThis & { Counter?: CounterGlobal }
scope.Counter = api

if (!manual && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    // A page script may already have started it with its own options.
    document.addEventListener('DOMContentLoaded', () => controller ?? api.auto(), { once: true })
  } else {
    api.auto()
  }
}

export { animateNumber, autoCounter, counter }
