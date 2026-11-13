import { isBrowser, prefersReducedMotion, readNumber, readString } from '@samline/internal'

export type Align = 'start' | 'center' | 'end' | 'nearest'
export type Easing = (progress: number) => number
export type ScrollTarget = Element | string | number

export interface ScrollToOptions {
  /**
   * What scrolls: the page (default), an element or a selector. Use the
   * element for scrolling boxes, tab strips and carousels.
   */
  container?: Element | Window | string | null
  /**
   * Space kept above the target, for fixed headers: pixels (`80`), a
   * percentage of the container height (`'10%'`), or an element or selector
   * whose height is used (`'#header'`). Defaults to `0`.
   */
  offset?: number | string | Element
  /** Vertical alignment. Defaults to `'start'`. */
  block?: Align
  /** Horizontal alignment. Defaults to `'nearest'`. */
  inline?: Align
  /**
   * Duration in milliseconds, or `'auto'` to scale with the distance
   * (300–1000 ms). Defaults to `'auto'`.
   */
  duration?: number | 'auto'
  /** A name (`'ease-in-out'`, `'ease-out'`, `'linear'`) or a function. Defaults to `'ease-in-out'`. */
  easing?: keyof typeof EASINGS | Easing
  /** `'instant'` jumps. Reduced motion always jumps. Defaults to `'smooth'`. */
  behavior?: 'smooth' | 'instant'
  /** Stop when the visitor scrolls, touches or presses a key. Defaults to `true`. */
  interruptible?: boolean
  /** Move keyboard focus to the target once it arrives. Defaults to `false`. */
  focus?: boolean
  /** Put the target's `#id` in the URL: `'push'`, `'replace'` or `false`. Defaults to `false`. */
  hash?: 'push' | 'replace' | false
}

export interface AutoScrollToOptions extends ScrollToOptions {
  /** Triggers to handle. Defaults to `'[data-scroll-to], a[href^="#"]'`. */
  selector?: string
  /** Where clicks are listened to. Defaults to `document`. */
  scope?: Document | Element
  /** On load, align the URL's `#id` with the offset. Defaults to `true`. */
  initialHash?: boolean
}

export interface ScrollToController {
  /** Stop handling clicks. */
  destroy: () => void
}

export const ATTRIBUTE = 'data-scroll-to'

export const EASINGS = {
  linear: (t: number) => t,
  'ease-out': (t: number) => 1 - (1 - t) ** 3,
  'ease-in-out': (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
}

const INTERRUPTIONS = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const

interface Running {
  cancel: () => void
}
const running = new WeakMap<object, Running>()

const resolveContainer = (container: ScrollToOptions['container']): Element | Window => {
  if (!container || container === window) return window
  if (typeof container === 'string') return document.querySelector(container) ?? window
  return container as Element
}

const resolveTarget = (target: ScrollTarget): Element | number | null => {
  if (typeof target === 'number') return target
  if (typeof target !== 'string') return target
  const value = target.trim()
  if (value === '#' || value === '#top' || value === 'top') return 0
  if (value.startsWith('#')) {
    let id = value.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      // Keep the raw id.
    }
    const byId = document.getElementById(id)
    if (byId) return byId
  }
  try {
    return document.querySelector(value)
  } catch {
    return null
  }
}

/** The visible box of the container and how far it can scroll. */
const viewport = (container: Element | Window) => {
  if (container === window) {
    const root = document.scrollingElement ?? document.documentElement
    return {
      top: 0,
      left: 0,
      width: root.clientWidth,
      height: root.clientHeight,
      x: window.scrollX,
      y: window.scrollY,
      maxX: root.scrollWidth - root.clientWidth,
      maxY: root.scrollHeight - root.clientHeight,
    }
  }
  const element = container as Element
  const box = element.getBoundingClientRect()
  return {
    top: box.top + element.clientTop,
    left: box.left + element.clientLeft,
    width: element.clientWidth,
    height: element.clientHeight,
    x: element.scrollLeft,
    y: element.scrollTop,
    maxX: element.scrollWidth - element.clientWidth,
    maxY: element.scrollHeight - element.clientHeight,
  }
}

const resolveOffset = (offset: ScrollToOptions['offset'], height: number): number => {
  if (offset === undefined) return 0
  if (typeof offset === 'number') return offset
  if (typeof offset !== 'string') return offset.getBoundingClientRect().height
  const value = offset.trim()
  if (/^-?\d*\.?\d+%$/.test(value)) return (height * parseFloat(value)) / 100
  if (/^-?\d*\.?\d+(px)?$/.test(value)) return parseFloat(value)
  const element = document.querySelector(value)
  return element ? element.getBoundingClientRect().height : 0
}

/** Scroll position along one axis that aligns `[start, end]` inside `[viewStart, viewEnd]`. */
const align = (
  mode: Align,
  current: number,
  start: number,
  end: number,
  viewStart: number,
  viewEnd: number
) => {
  const size = end - start
  const view = viewEnd - viewStart
  if (mode === 'start') return current + start - viewStart
  if (mode === 'end') return current + end - viewEnd
  if (mode === 'center') return current + start - viewStart - (view - size) / 2
  // nearest: only move when it is (partly) outside.
  if (start < viewStart || size > view) return current + start - viewStart
  if (end > viewEnd) return current + end - viewEnd
  return current
}

const clamp = (value: number, max: number) => Math.min(Math.max(0, max), Math.max(0, value))

/** Where the container must scroll to show `target` as asked. */
export function scrollPosition(
  target: ScrollTarget,
  options: Omit<ScrollToOptions, 'duration' | 'easing' | 'behavior'> = {}
): { top: number; left: number } | null {
  if (!isBrowser()) return null
  const container = resolveContainer(options.container)
  const resolved = resolveTarget(target)
  if (resolved === null) return null
  const view = viewport(container)
  if (typeof resolved === 'number') return { top: clamp(resolved, view.maxY), left: view.x }
  const offset = resolveOffset(options.offset, view.height)
  const box = resolved.getBoundingClientRect()
  const top = align(
    options.block ?? 'start',
    view.y,
    box.top,
    box.bottom,
    view.top + offset,
    view.top + view.height
  )
  const left = align(
    options.inline ?? 'nearest',
    view.x,
    box.left,
    box.right,
    view.left,
    view.left + view.width
  )
  return { top: clamp(top, view.maxY), left: clamp(left, view.maxX) }
}

const setScroll = (container: Element | Window, top: number, left: number) =>
  container.scrollTo({ top, left, behavior: 'instant' as ScrollBehavior })

const moveFocus = (target: Element | number | null) => {
  if (!(target instanceof HTMLElement || target instanceof SVGElement)) return
  if (!target.matches('a[href], button, input, select, textarea, [tabindex], [contenteditable]')) {
    target.setAttribute('tabindex', '-1')
  }
  target.focus({ preventScroll: true })
}

const writeHash = (target: Element | number | null, mode: ScrollToOptions['hash']) => {
  if (!mode) return
  const id = target instanceof Element ? target.id : ''
  if (target instanceof Element && !id) return
  const url = new URL(window.location.href)
  url.hash = id ? `#${encodeURIComponent(id)}` : ''
  if (url.href === window.location.href) return
  history[mode === 'push' ? 'pushState' : 'replaceState'](history.state, '', url)
}

/**
 * Smoothly scroll the page (or `container`) to `target`: an element, a
 * selector, an `#id`, `'top'` or a vertical position in pixels.
 *
 * The destination is measured again on every frame, so content that loads
 * on the way (images, fonts) does not make it land in the wrong place. A new
 * call on the same container replaces the running one. Resolves to `true`
 * when it arrives and `false` when it is interrupted, replaced or the target
 * does not exist.
 */
export function scrollTo(target: ScrollTarget, options: ScrollToOptions = {}): Promise<boolean> {
  if (!isBrowser()) return Promise.resolve(false)
  const container = resolveContainer(options.container)
  const resolved = resolveTarget(target)
  const first = scrollPosition(target, options)
  if (!first) return Promise.resolve(false)

  running.get(container)?.cancel()

  const finish = () => {
    if (options.focus) moveFocus(resolved)
    writeHash(resolved, options.hash)
  }

  const start = viewport(container)
  const distance = Math.hypot(first.top - start.y, first.left - start.x)
  const duration =
    options.duration === undefined || options.duration === 'auto'
      ? Math.min(1000, Math.max(300, distance / 2))
      : Math.max(0, options.duration)
  const instant =
    options.behavior === 'instant' || prefersReducedMotion() || duration === 0 || distance < 1

  if (instant) {
    setScroll(container, first.top, first.left)
    finish()
    return Promise.resolve(true)
  }

  const easing =
    typeof options.easing === 'function'
      ? options.easing
      : (EASINGS[options.easing ?? 'ease-in-out'] ?? EASINGS['ease-in-out'])
  const interruptible = options.interruptible ?? true

  return new Promise<boolean>(resolve => {
    let frame = 0
    let begin: number | null = null

    const stop = (arrived: boolean) => {
      cancelAnimationFrame(frame)
      if (running.get(container) === entry) running.delete(container)
      if (interruptible) {
        for (const type of INTERRUPTIONS) window.removeEventListener(type, interrupt)
      }
      if (arrived) finish()
      resolve(arrived)
    }
    const interrupt = () => stop(false)
    const entry: Running = { cancel: interrupt }
    running.set(container, entry)
    if (interruptible) {
      for (const type of INTERRUPTIONS) window.addEventListener(type, interrupt, { passive: true })
    }

    const step = (now: number) => {
      begin ??= now
      const progress = duration ? Math.min(1, (now - begin) / duration) : 1
      // Measure again: the target may have moved while content loaded.
      const goal = scrollPosition(target, options) ?? first
      const eased = easing(progress)
      setScroll(
        container,
        start.y + (goal.top - start.y) * eased,
        start.x + (goal.left - start.x) * eased
      )
      if (progress < 1) frame = requestAnimationFrame(step)
      else stop(true)
    }
    frame = requestAnimationFrame(step)
  })
}

/** Stop the scroll running on `container` (the page by default). */
export function cancelScroll(container?: ScrollToOptions['container']): void {
  if (!isBrowser()) return
  running.get(resolveContainer(container))?.cancel()
}

/** The target of a trigger: its `data-scroll-to` value, or a same-page link's hash. */
const triggerTarget = (trigger: Element): string | null => {
  const value = trigger.getAttribute(ATTRIBUTE)
  if (value) return value
  if (!(trigger instanceof HTMLAnchorElement)) return null
  const href = trigger.getAttribute('href') ?? ''
  if (href.startsWith('#')) return href
  const here = window.location
  if (
    trigger.origin === here.origin &&
    trigger.pathname === here.pathname &&
    trigger.search === here.search &&
    trigger.hash
  )
    return trigger.hash
  return null
}

const triggerOptions = (trigger: Element, base: ScrollToOptions): ScrollToOptions => {
  const options: ScrollToOptions = { ...base }
  const offset = readString(trigger, 'data-scroll-to-offset', '')
  if (offset) options.offset = offset
  const container = readString(trigger, 'data-scroll-to-container', '')
  if (container) options.container = container
  const block = readString(trigger, 'data-scroll-to-block', '')
  if (block) options.block = block as Align
  const inline = readString(trigger, 'data-scroll-to-inline', '')
  if (inline) options.inline = inline as Align
  const duration = readNumber(trigger, 'data-scroll-to-duration', NaN)
  if (Number.isFinite(duration)) options.duration = duration
  return options
}

/**
 * Handle clicks on `[data-scroll-to]` elements and same-page `#id` links in
 * `scope`, with one delegated listener (so triggers added later work too).
 * Links keep their URL, history and focus behavior: the hash is pushed and
 * focus moves to the target. Clicks with a modifier key, or whose default
 * another script prevented, are left alone. Returns `{ destroy }`.
 */
export function autoScrollTo({
  selector = `[${ATTRIBUTE}], a[href^="#"]`,
  scope,
  initialHash = true,
  ...options
}: AutoScrollToOptions = {}): ScrollToController {
  if (!isBrowser()) return { destroy: () => {} }
  const root = scope ?? document
  const base: ScrollToOptions = { focus: true, hash: 'push', ...options }

  const onClick = (event: Event) => {
    const mouse = event as MouseEvent
    if (event.defaultPrevented || mouse.button > 0) return
    if (mouse.metaKey || mouse.ctrlKey || mouse.shiftKey || mouse.altKey) return
    const trigger = (event.target as Element | null)?.closest?.(selector)
    if (!trigger || !root.contains(trigger)) return
    const target = triggerTarget(trigger)
    if (!target || resolveTarget(target) === null) return
    event.preventDefault()
    void scrollTo(target, triggerOptions(trigger, base))
  }

  root.addEventListener('click', onClick)

  // The browser jumps to the URL's hash without the offset; align it once.
  const hash = window.location.hash
  const alignHash = () =>
    void scrollTo(hash, { ...options, behavior: 'instant', focus: false, hash: false })
  const fixHash = initialHash && options.offset !== undefined && hash.length > 1
  if (fixHash) {
    if (document.readyState === 'complete') alignHash()
    else window.addEventListener('load', alignHash, { once: true })
  }

  return {
    destroy: () => {
      root.removeEventListener('click', onClick)
      window.removeEventListener('load', alignHash)
    },
  }
}
