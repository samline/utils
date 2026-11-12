import { isBrowser, noop } from './env.js'

export type Cleanup = () => void

export interface AutoInitOptions {
  /** Elements to initialize, for example `[data-reveal]`. */
  selector: string
  /** Initialize one element. Return a cleanup to run when it is removed or on destroy. */
  init: (element: Element) => Cleanup | void
  /** Where to look. Defaults to `document`. */
  root?: ParentNode
  /**
   * Watch `root` for elements added or removed later (AJAX content, framework
   * swaps, drawers). Defaults to true.
   */
  observe?: boolean
}

export interface AutoInitController {
  /** Initialize matching elements that are not initialized yet. */
  refresh: () => void
  /** Run every cleanup and stop watching. */
  destroy: () => void
}

/**
 * Initialize every element matching `selector` exactly once, pick up elements
 * added later, and clean up elements that leave the DOM.
 *
 * Safe to call without a DOM: it returns an inert controller.
 */
export const autoInit = ({
  selector,
  init,
  root,
  observe = true,
}: AutoInitOptions): AutoInitController => {
  if (!isBrowser()) return { refresh: noop, destroy: noop }

  const scope: ParentNode = root ?? document
  const cleanups = new Map<Element, Cleanup>()

  const initOne = (element: Element) => {
    if (cleanups.has(element)) return
    cleanups.set(element, init(element) ?? noop)
  }

  const destroyOne = (element: Element) => {
    const cleanup = cleanups.get(element)
    if (!cleanup) return
    cleanups.delete(element)
    cleanup()
  }

  const forEachMatch = (node: Node, callback: (element: Element) => void) => {
    if (!(node instanceof Element)) return
    if (node.matches(selector)) callback(node)
    node.querySelectorAll(selector).forEach(callback)
  }

  const refresh = () => scope.querySelectorAll(selector).forEach(initOne)

  let observer: MutationObserver | null = null

  if (observe && typeof MutationObserver === 'function') {
    observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        mutation.removedNodes.forEach(node =>
          forEachMatch(node, element => {
            // A node moved inside the same document is removed and re-added in
            // one batch; only clean up elements that really left.
            if (!element.isConnected) destroyOne(element)
          })
        )
        mutation.addedNodes.forEach(node => forEachMatch(node, initOne))
      }
    })
    const target = scope instanceof Document ? scope.documentElement : (scope as Node)
    observer.observe(target, { childList: true, subtree: true })
  }

  refresh()

  return {
    refresh,
    destroy: () => {
      observer?.disconnect()
      observer = null
      Array.from(cleanups.keys()).forEach(destroyOne)
    },
  }
}
