import {
  autoInit,
  isBrowser,
  noop,
  onReducedMotionChange,
  prefersReducedMotion,
  readBoolean,
  readNumber,
  readString,
  resolveElements,
  type AutoInitController,
  type ElementTarget,
} from '@samline/internal'
import { observeVisibility } from '@samline/is-visible/core'

export type { AutoInitController, ElementTarget }

/** Effects shipped in `style.css`. An empty `data-reveal` means `'up'`. */
export const REVEAL_EFFECTS = ['up', 'down', 'left', 'right', 'fade', 'zoom', 'blur'] as const

export type RevealEffect = (typeof REVEAL_EFFECTS)[number]

/** `pending` (hidden), `revealing` (transition running) or `revealed`. */
export type RevealState = 'pending' | 'revealing' | 'revealed'

export interface RevealOptions {
  /** Effect for elements whose `data-reveal` is empty or missing. Defaults to `'up'`. */
  effect?: RevealEffect
  /** Transition length in milliseconds. Defaults to the CSS value (600). */
  duration?: number
  /** Delay before the transition in milliseconds. Defaults to the CSS value (0). */
  delay?: number
  /** CSS length for `up`, `down`, `left` and `right`. Defaults to the CSS value (`0.75rem`). */
  distance?: string
  /**
   * Milliseconds added per element when several elements are revealed
   * together, in document order, so they appear in cascade. Defaults to `0`.
   */
  stagger?: number
  /** Hide again after leaving the viewport, and reveal on every entry. Defaults to `false`. */
  repeat?: boolean
  /** Scroll container. Defaults to the viewport. */
  root?: Element | Document | null
  /** Grow or shrink the root box. Defaults to `'0px 0px 64px 0px'`: starts just before entering. */
  rootMargin?: string
  /** Share of the element that must be visible, `0` to `1`. Defaults to `0`. */
  threshold?: number
  /**
   * Called when an element is shown: when its transition starts, or right
   * away for elements that were already in view and never hidden.
   */
  onReveal?: (element: Element) => void
  /** Called when a `repeat` element is hidden again after leaving the viewport. */
  onHide?: (element: Element) => void
}

export interface AutoRevealOptions extends RevealOptions {
  /** Elements to reveal. Defaults to `'[data-reveal]'`. */
  selector?: string
  /** Where to look for them. Defaults to `document`. */
  scope?: ParentNode
  /** Also reveal matching elements added later. Defaults to `true`. */
  observe?: boolean
}

export const ATTRIBUTE = 'data-reveal'
export const STATE_ATTRIBUTE = 'data-reveal-state'
const SCRUB_ATTRIBUTE = 'data-reveal-scrub'
const STAGGER_ATTRIBUTE = 'data-reveal-stagger'
const DEFAULT_ROOT_MARGIN = '0px 0px 64px 0px'

const isEffect = (value: string | null): value is RevealEffect =>
  (REVEAL_EFFECTS as readonly string[]).includes(value ?? '')

const setState = (element: Element, state: RevealState) =>
  element.setAttribute(STATE_ATTRIBUTE, state)

/** `"0.6s, 200ms"` → `[600, 200]`. */
const toMilliseconds = (list: string): number[] =>
  list.split(',').map(part => {
    const value = parseFloat(part)
    if (!Number.isFinite(value)) return 0
    return part.trim().endsWith('ms') ? value : value * 1000
  })

/** Longest duration + delay among the element's computed transitions. */
const transitionTime = (element: Element): number => {
  const style = getComputedStyle(element)
  const durations = toMilliseconds(style.transitionDuration)
  const delays = toMilliseconds(style.transitionDelay)
  return durations.reduce((max, duration, i) => Math.max(max, duration + (delays[i] ?? 0)), 0)
}

const ms = (value: number) => `${Math.max(0, value)}ms`

/* ------------------------------------------------------------------------ */
/* Cascade: elements revealed in the same frame are staggered together.      */
/* ------------------------------------------------------------------------ */

interface Tracked {
  element: Element
  /** Elements with the same group cascade together. */
  group: Element | number
  stagger: number
  baseDelay: number
  start: () => void
}

let queue: Tracked[] = []
let scheduled = false

const byDocumentOrder = (a: Tracked, b: Tracked) =>
  a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

const flush = () => {
  scheduled = false
  const batch = queue.sort(byDocumentOrder)
  queue = []
  const indexes = new Map<Element | number, number>()
  for (const item of batch) {
    if (item.stagger > 0) {
      const index = indexes.get(item.group) ?? 0
      indexes.set(item.group, index + 1)
      if (index > 0) {
        ;(item.element as HTMLElement).style.setProperty(
          '--reveal-delay',
          ms(item.baseDelay + index * item.stagger)
        )
      }
    }
    item.start()
  }
}

const enqueue = (item: Tracked) => {
  queue.push(item)
  if (scheduled) return
  scheduled = true
  queueMicrotask(flush)
}

/* ------------------------------------------------------------------------ */

interface ElementSetup {
  repeat: boolean
  group: Element | number
  stagger: number
  baseDelay: number
  restore: () => void
}

/** Apply per-element settings (attribute first, then options). Returns how to undo them. */
const prepare = (element: HTMLElement, options: RevealOptions): ElementSetup => {
  const undo: Array<() => void> = []

  const current = element.getAttribute(ATTRIBUTE)
  if (!isEffect(current)) {
    const effect = options.effect ?? 'up'
    element.setAttribute(ATTRIBUTE, effect)
    undo.push(() =>
      current === null
        ? element.removeAttribute(ATTRIBUTE)
        : element.setAttribute(ATTRIBUTE, current)
    )
  }

  const setVar = (name: string, value: string | null) => {
    if (value === null) return
    const previous = element.style.getPropertyValue(name)
    element.style.setProperty(name, value)
    undo.push(() =>
      previous ? element.style.setProperty(name, previous) : element.style.removeProperty(name)
    )
  }

  const duration = readNumber(element, 'data-reveal-duration', options.duration ?? Number.NaN)
  const delay = readNumber(element, 'data-reveal-delay', options.delay ?? Number.NaN)
  const distance = readString(element, 'data-reveal-distance', options.distance ?? '')
  setVar('--reveal-duration', Number.isFinite(duration) ? ms(duration) : null)
  setVar('--reveal-delay', Number.isFinite(delay) ? ms(delay) : null)
  setVar('--reveal-distance', distance || null)

  // `--reveal-delay` may also come from your CSS; the cascade adds to it.
  const inlineDelay = element.style.getPropertyValue('--reveal-delay')
  undo.push(() =>
    inlineDelay
      ? element.style.setProperty('--reveal-delay', inlineDelay)
      : element.style.removeProperty('--reveal-delay')
  )

  // Elements cascade with the others of their closest `data-reveal-stagger`
  // container, or with the other elements of calls using the same `stagger`.
  const staggerHost = element.closest(`[${STAGGER_ATTRIBUTE}]`)
  const stagger = staggerHost
    ? readNumber(staggerHost, STAGGER_ATTRIBUTE, options.stagger ?? 0)
    : (options.stagger ?? 0)

  const baseDelay =
    toMilliseconds(getComputedStyle(element).getPropertyValue('--reveal-delay') || '0ms')[0] ?? 0

  return {
    repeat: readBoolean(element, 'data-reveal-repeat', options.repeat ?? false),
    group: staggerHost ?? stagger,
    stagger: Math.max(0, stagger),
    baseDelay: Number.isFinite(delay) ? delay : baseDelay,
    restore: () => undo.reverse().forEach(fn => fn()),
  }
}

/**
 * Reveal elements as they scroll into view.
 *
 * - Elements that are already in view (or above it) on load are never
 *   hidden, so the first paint never flickers.
 * - Elements below the fold are hidden (`data-reveal-state="pending"`) and
 *   revealed with a CSS transition when they enter.
 * - With reduced motion, everything stays visible.
 * - `data-reveal-scrub` elements are left to CSS.
 * - Safe without a DOM: returns a no-op cleanup.
 *
 * Load `@samline/reveal/style.css` for the effects. Returns a cleanup that
 * stops observing and removes everything the call added.
 */
export function reveal(
  target: ElementTarget = `[${ATTRIBUTE}]`,
  options: RevealOptions = {}
): () => void {
  if (!isBrowser()) return noop

  const elements = resolveElements(target).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && !element.hasAttribute(SCRUB_ATTRIBUTE)
  )
  if (elements.length === 0) return noop

  const { onReveal, onHide } = options
  const timers = new Set<ReturnType<typeof setTimeout>>()
  const cleanups: Array<() => void> = []
  const pending = new Set<HTMLElement>()
  const groups = new Map<boolean, HTMLElement[]>()
  const setups = new Map<HTMLElement, ElementSetup>()
  let active = true

  for (const element of elements) {
    const setup = prepare(element, options)
    setups.set(element, setup)
    groups.set(setup.repeat, [...(groups.get(setup.repeat) ?? []), element])
  }

  const finish = (element: HTMLElement) => {
    const timer = setTimeout(
      () => {
        timers.delete(timer)
        if (active && element.getAttribute(STATE_ATTRIBUTE) === 'revealing')
          setState(element, 'revealed')
      },
      transitionTime(element) + 50
    )
    timers.add(timer)
  }

  const show = (element: HTMLElement) => {
    pending.delete(element)
    const setup = setups.get(element)!
    enqueue({
      element,
      group: setup.group,
      stagger: setup.stagger,
      baseDelay: setup.baseDelay,
      start: () => {
        if (!active || element.getAttribute(STATE_ATTRIBUTE) !== 'pending') return
        setState(element, 'revealing')
        onReveal?.(element)
        finish(element)
      },
    })
  }

  const hide = (element: HTMLElement) => {
    setState(element, 'pending')
    pending.add(element)
  }

  const showAllNow = () => {
    pending.forEach(element => setState(element, 'revealed'))
    pending.clear()
  }

  const reduced = prefersReducedMotion()

  groups.forEach((group, repeat) => {
    const seen = new WeakSet<Element>()

    cleanups.push(
      observeVisibility(group, {
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? DEFAULT_ROOT_MARGIN,
        threshold: options.threshold ?? 0,
        once: !repeat,
        inOut: repeat,
        onChange: (entry, target) => {
          const element = target as HTMLElement
          if (seen.has(element)) return
          seen.add(element)
          if (entry.isIntersecting) return
          const bottom = entry.rootBounds?.bottom ?? window.innerHeight
          const below = entry.boundingClientRect.top >= bottom
          // Content above the viewport is only hidden when it will be
          // revealed again on the way back (`repeat`).
          if (!reduced && (below || repeat) && entry.boundingClientRect.height > 0) hide(element)
          else {
            setState(element, 'revealed')
            onReveal?.(element)
          }
        },
        visible: (_, target) => {
          const element = target as HTMLElement
          if (element.getAttribute(STATE_ATTRIBUTE) === 'pending') show(element)
          else if (!element.hasAttribute(STATE_ATTRIBUTE)) {
            // In view on load: shown without animation.
            setState(element, 'revealed')
            onReveal?.(element)
          }
        },
        notVisible: (_, target) => {
          const element = target as HTMLElement
          if (reduced || prefersReducedMotion()) return
          hide(element)
          onHide?.(element)
        },
      })
    )
  })

  cleanups.push(
    onReducedMotionChange(isReduced => {
      if (isReduced) showAllNow()
    })
  )

  return () => {
    if (!active) return
    active = false
    cleanups.forEach(cleanup => cleanup())
    timers.forEach(clearTimeout)
    timers.clear()
    pending.clear()
    setups.forEach((setup, element) => {
      element.removeAttribute(STATE_ATTRIBUTE)
      setup.restore()
    })
  }
}

/**
 * Reveal every `[data-reveal]` element in `scope`, including elements added
 * later (AJAX content, framework swaps), and clean up elements that are
 * removed. Returns a controller with `refresh()` and `destroy()`.
 */
export function autoReveal({
  selector = `[${ATTRIBUTE}]`,
  scope,
  observe = true,
  ...options
}: AutoRevealOptions = {}): AutoInitController {
  return autoInit({
    selector,
    observe,
    ...(scope && { root: scope }),
    init: element => reveal(element, options),
  })
}
