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

/* ------------------------------------------------------------------------ */
/* Number tween                                                              */
/* ------------------------------------------------------------------------ */

export const EASINGS = {
  linear: (t: number) => t,
  'ease-out': (t: number) => 1 - (1 - t) ** 3,
  'ease-in-out': (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2),
} as const

export type EasingName = keyof typeof EASINGS

/** A named easing or a function from progress (`0`–`1`) to eased progress. */
export type Easing = EasingName | ((progress: number) => number)

const isEasingName = (value: unknown): value is EasingName =>
  typeof value === 'string' && Object.prototype.hasOwnProperty.call(EASINGS, value)

export interface AnimateNumberOptions {
  /** Defaults to `0`. */
  from?: number
  to: number
  /** Milliseconds. Defaults to `2000`. */
  duration?: number
  /** Milliseconds before starting. Defaults to `0`. */
  delay?: number
  /** Defaults to `'ease-out'`. */
  easing?: Easing
  /** Called on every frame with the current value, and once with `to` at the end. */
  onUpdate: (value: number) => void
  /** Called once `to` has been reached. Not called when cancelled. */
  onComplete?: () => void
}

const resolveEasing = (easing: Easing = 'ease-out') =>
  typeof easing === 'function'
    ? easing
    : isEasingName(easing)
      ? EASINGS[easing]
      : EASINGS['ease-out']

/**
 * Animate a number from `from` to `to` over time, frame by frame. Returns a
 * function that cancels it. Without `requestAnimationFrame` (on the server),
 * or with a duration of `0`, it jumps to `to` at once.
 */
export function animateNumber({
  from = 0,
  to,
  duration = 2000,
  delay = 0,
  easing,
  onUpdate,
  onComplete,
}: AnimateNumberOptions): () => void {
  const ease = resolveEasing(easing)
  const finish = () => {
    onUpdate(to)
    onComplete?.()
  }

  if (duration <= 0 || typeof requestAnimationFrame !== 'function') {
    finish()
    return noop
  }

  let frame = 0
  let start: number | null = null
  const step = (now: number) => {
    start ??= now + Math.max(0, delay)
    const progress = Math.min(Math.max((now - start) / duration, 0), 1)
    if (progress >= 1) return finish()
    onUpdate(from + (to - from) * ease(progress))
    frame = requestAnimationFrame(step)
  }
  frame = requestAnimationFrame(step)

  return () => cancelAnimationFrame(frame)
}

/* ------------------------------------------------------------------------ */
/* Parsing and formatting                                                    */
/* ------------------------------------------------------------------------ */

const decimalSeparator = (locale: string | undefined) =>
  new Intl.NumberFormat(locale).formatToParts(1.5).find(part => part.type === 'decimal')?.value ??
  '.'

const fractionDigits = (normalized: string) => normalized.split('.')[1]?.length ?? 0

/**
 * Read a number written for people in `locale`: `"1,234.5"` in English,
 * `"1.234,5"` in German, `"−12 %"`. Returns the value and its decimals.
 */
export const parseNumber = (
  text: string,
  locale?: string
): { value: number; decimals: number } | null => {
  const decimal = decimalSeparator(locale)
  let normalized = ''
  for (const char of text.trim()) {
    if (char >= '0' && char <= '9') normalized += char
    else if (char === decimal) normalized += '.'
    else if ((char === '-' || char === '−') && normalized === '') normalized = '-'
  }
  if (!/\d/.test(normalized)) return null
  const value = Number(normalized)
  return Number.isFinite(value) ? { value, decimals: fractionDigits(normalized) } : null
}

const safeLocale = (locale: string | undefined) => {
  try {
    return Intl.NumberFormat.supportedLocalesOf(locale ?? []).length ? locale : undefined
  } catch {
    return undefined
  }
}

/* ------------------------------------------------------------------------ */
/* Counter                                                                   */
/* ------------------------------------------------------------------------ */

/** `pending` (showing `from`), `counting` or `done`. */
export type CounterState = 'pending' | 'counting' | 'done'

export interface CounterOptions {
  /** Starting value. Defaults to `0`. */
  from?: number
  /**
   * Final value when the element has no number in `data-counter`. By default
   * it is read from the element's text, formatted for its locale.
   */
  to?: number
  /** Milliseconds. Defaults to `2000`. */
  duration?: number
  /** Milliseconds before counting starts. Defaults to `0`. */
  delay?: number
  /** Defaults to `'ease-out'`. */
  easing?: Easing
  /** Decimals to show. Defaults to the decimals of the final value. */
  decimals?: number
  /** BCP 47 locale for formatting. Defaults to the closest `lang` attribute. */
  locale?: string
  /** Extra `Intl.NumberFormat` options, for example `{ style: 'percent' }` or `{ notation: 'compact' }`. */
  format?: Intl.NumberFormatOptions
  /** Full control over the text. Replaces `locale`, `decimals` and `format`. */
  formatter?: (value: number, element: Element) => string
  /** Count again every time the element enters. Defaults to `false`. */
  repeat?: boolean
  /** Scroll container. Defaults to the viewport. */
  root?: Element | Document | null
  /** Grow or shrink the root box. Defaults to `'0px'`. */
  rootMargin?: string
  /** Share of the element that must be visible to start, `0` to `1`. Defaults to `0.5`. */
  threshold?: number
  onStart?: (element: Element) => void
  onUpdate?: (value: number, element: Element) => void
  onComplete?: (element: Element) => void
}

export interface AutoCounterOptions extends CounterOptions {
  /** Elements to count. Defaults to `'[data-counter]'`. */
  selector?: string
  /** Where to look for them. Defaults to `document`. */
  scope?: ParentNode
  /** Also count matching elements added later. Defaults to `true`. */
  observe?: boolean
}

export const ATTRIBUTE = 'data-counter'
export const STATE_ATTRIBUTE = 'data-counter-state'

interface Setup {
  from: number
  to: number
  duration: number
  delay: number
  easing: Easing
  repeat: boolean
  format: (value: number) => string
  original: string
}

const prepare = (element: HTMLElement, options: CounterOptions): Setup | null => {
  const locale = safeLocale(
    readString(element, 'data-counter-locale', '') ||
      options.locale ||
      element.closest('[lang]')?.getAttribute('lang') ||
      undefined
  )
  const original = element.textContent ?? ''

  // Final value: the attribute, then the option, then the visible text.
  const raw = element.getAttribute(ATTRIBUTE)?.trim() ?? ''
  const fromAttribute = raw && Number.isFinite(Number(raw)) ? Number(raw) : null
  const parsed =
    fromAttribute === null && options.to === undefined ? parseNumber(original, locale) : null
  const to = fromAttribute ?? options.to ?? parsed?.value
  if (to === undefined) return null

  let inferred = fromAttribute !== null ? fractionDigits(raw) : (parsed?.decimals ?? 0)
  // Percent formatting multiplies by 100: 0.25 is "25%", with no decimals.
  if (options.format?.style === 'percent' && fromAttribute !== null)
    inferred = Math.max(0, inferred - 2)
  const decimals = Math.min(
    Math.max(
      0,
      Math.round(readNumber(element, 'data-counter-decimals', options.decimals ?? inferred))
    ),
    20
  )

  let format: (value: number) => string
  if (options.formatter) {
    const custom = options.formatter
    format = value => custom(value, element)
  } else {
    const formatter = new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...options.format,
    })
    // Values rounding to zero on the way up from a negative start would read "-0".
    const negativeZero = formatter.format(-0)
    const zero = formatter.format(0)
    format = value => {
      const text = formatter.format(value)
      return text === negativeZero ? zero : text
    }
  }

  const easingAttribute = element.getAttribute('data-counter-easing')?.trim()

  return {
    from: readNumber(element, 'data-counter-from', options.from ?? 0),
    to,
    duration: readNumber(element, 'data-counter-duration', options.duration ?? 2000),
    delay: readNumber(element, 'data-counter-delay', options.delay ?? 0),
    easing: isEasingName(easingAttribute) ? easingAttribute : (options.easing ?? 'ease-out'),
    repeat: readBoolean(element, 'data-counter-repeat', options.repeat ?? false),
    format,
    original,
  }
}

/**
 * Count numbers as they scroll into view.
 *
 * Render the final value in the HTML (`<span data-counter>1,234</span>`):
 * it stays visible without JavaScript and for search engines. When the
 * script runs, each element shows `from` and counts to the final value once
 * half of it is visible. With reduced motion it keeps the final value.
 *
 * Returns a cleanup that stops everything and restores the original text.
 */
export function counter(
  target: ElementTarget = `[${ATTRIBUTE}]`,
  options: CounterOptions = {}
): () => void {
  if (!isBrowser()) return noop

  const setups = new Map<HTMLElement, Setup>()
  for (const element of resolveElements(target)) {
    if (!(element instanceof HTMLElement)) continue
    const setup = prepare(element, options)
    if (setup) setups.set(element, setup)
  }
  if (setups.size === 0) return noop

  const cancels = new Map<HTMLElement, () => void>()
  const cleanups: Array<() => void> = []
  const reduced = prefersReducedMotion()

  const setState = (element: HTMLElement, state: CounterState) =>
    element.setAttribute(STATE_ATTRIBUTE, state)

  const stop = (element: HTMLElement) => {
    cancels.get(element)?.()
    cancels.delete(element)
  }

  const show = (element: HTMLElement, value: number) => {
    element.textContent = setups.get(element)!.format(value)
  }

  const complete = (element: HTMLElement) => {
    stop(element)
    show(element, setups.get(element)!.to)
    setState(element, 'done')
    options.onComplete?.(element)
  }

  const start = (element: HTMLElement) => {
    const setup = setups.get(element)!
    stop(element)
    if (prefersReducedMotion()) return complete(element)
    setState(element, 'counting')
    options.onStart?.(element)
    cancels.set(
      element,
      animateNumber({
        from: setup.from,
        to: setup.to,
        duration: setup.duration,
        delay: setup.delay,
        easing: setup.easing,
        onUpdate: value => {
          show(element, value)
          options.onUpdate?.(value, element)
        },
        onComplete: () => {
          cancels.delete(element)
          complete(element)
        },
      })
    )
  }

  const reset = (element: HTMLElement) => {
    stop(element)
    show(element, setups.get(element)!.from)
    setState(element, 'pending')
  }

  const groups = new Map<boolean, HTMLElement[]>()
  setups.forEach((setup, element) => {
    if (reduced) {
      // Keep the text as rendered; nothing moves.
      setState(element, 'done')
      options.onComplete?.(element)
      return
    }
    reset(element)
    groups.set(setup.repeat, [...(groups.get(setup.repeat) ?? []), element])
  })

  groups.forEach((group, repeat) => {
    cleanups.push(
      observeVisibility(group, {
        root: options.root ?? null,
        rootMargin: options.rootMargin ?? '0px',
        threshold: options.threshold ?? 0.5,
        once: !repeat,
        inOut: repeat,
        visible: (_, element) => start(element as HTMLElement),
        notVisible: (_, element) => {
          if (!prefersReducedMotion()) reset(element as HTMLElement)
        },
      })
    )
  })

  cleanups.push(
    onReducedMotionChange(isReduced => {
      if (!isReduced) return
      setups.forEach((_, element) => {
        if (element.getAttribute(STATE_ATTRIBUTE) !== 'done') complete(element)
      })
    })
  )

  let active = true
  return () => {
    if (!active) return
    active = false
    cleanups.forEach(cleanup => cleanup())
    setups.forEach((setup, element) => {
      stop(element)
      element.textContent = setup.original
      element.removeAttribute(STATE_ATTRIBUTE)
    })
  }
}

/**
 * Count every `[data-counter]` element in `scope`, including elements added
 * later, and clean up elements that are removed. Returns a controller with
 * `refresh()` and `destroy()`.
 */
export function autoCounter({
  selector = `[${ATTRIBUTE}]`,
  scope,
  observe = true,
  ...options
}: AutoCounterOptions = {}): AutoInitController {
  return autoInit({
    selector,
    observe,
    ...(scope && { root: scope }),
    init: element => counter(element, options),
  })
}
