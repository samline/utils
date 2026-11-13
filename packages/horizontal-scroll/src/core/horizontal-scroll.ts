import {
  autoInit,
  isBrowser,
  onReducedMotionChange,
  prefersReducedMotion,
  readBoolean,
  readNumber,
  readString,
  resolveElements,
  type AutoInitController,
  type ElementTarget,
} from '@samline/internal'

export type { AutoInitController, ElementTarget }

export interface HorizontalScrollProgress {
  /** From 0 (start) to 1 (end of the track). */
  progress: number
  /** Current horizontal shift of the track, in pixels (0 or negative). */
  x: number
  /** How far the track moves in total, in pixels. */
  distance: number
}

export interface HorizontalScrollOptions {
  /**
   * The row that moves sideways: a selector inside the section or an element.
   * Defaults to `[data-horizontal-scroll-track]`, or the first child.
   */
  track?: string | Element
  /**
   * Where the track pins, from the top of the viewport (or `root`): pixels
   * (`64`) or a percentage of its height (`'10%'`). Use it to clear a fixed
   * header. Defaults to `0`.
   */
  top?: number | string
  /**
   * Scroll container holding the section, when it is not the page. Defaults
   * to the viewport.
   */
  root?: Element | null
  /**
   * Horizontal pixels moved per vertical pixel scrolled. `2` crosses the
   * track in half the scrolling. Defaults to `1`.
   */
  speed?: number
  /**
   * Media query that turns the effect on, for example `'(min-width: 768px)'`.
   * Outside it the section is left to your CSS. Defaults to always.
   */
  media?: string
  /**
   * Turn the effect off when the visitor prefers reduced motion. Defaults to `true`.
   */
  respectReducedMotion?: boolean
  /**
   * Scroll the page so a focused element inside the track is visible.
   * Defaults to `true`.
   */
  followFocus?: boolean
  /** Called whenever the progress changes. */
  onProgress?: (state: HorizontalScrollProgress) => void
}

export interface AutoHorizontalScrollOptions extends HorizontalScrollOptions {
  /** Sections to set up. Defaults to `'[data-horizontal-scroll]'`. */
  selector?: string
  /** Where to look for them. Defaults to `document`. */
  scope?: ParentNode
  /** Also set up matching sections added later. Defaults to `true`. */
  observe?: boolean
}

export interface HorizontalScroll {
  /** True while the section is pinned and moving sideways. */
  readonly active: boolean
  /** From 0 to 1. */
  readonly progress: number
  /** Measure again, for example after changing the content. */
  refresh: () => void
  /** Stop and restore every style it set. */
  destroy: () => void
}

export const ATTRIBUTE = 'data-horizontal-scroll'
export const TRACK_ATTRIBUTE = 'data-horizontal-scroll-track'
export const STATE_ATTRIBUTE = 'data-horizontal-scroll-state'
export const PROGRESS_PROPERTY = '--horizontal-scroll-progress'

const noop = () => {}
const inert: HorizontalScroll = { active: false, progress: 0, refresh: noop, destroy: noop }

/** `64` → 64 px; `'10%'` → a tenth of `height`; `'64px'` or `'64'` → 64 px. */
const resolveLength = (value: number | string, height: number) => {
  if (typeof value === 'number') return value
  const number = parseFloat(value)
  if (!Number.isFinite(number)) return 0
  return value.trim().endsWith('%') ? (height * number) / 100 : number
}

const clamp = (value: number) => Math.min(1, Math.max(0, value))

/** `overflow-x: clip` keeps `position: sticky` working; older engines get paint containment. */
const clipProperty = () =>
  typeof CSS !== 'undefined' && CSS.supports?.('overflow-x', 'clip')
    ? (['overflow-x', 'clip'] as const)
    : (['contain', 'paint'] as const)

/**
 * Pin `section` while its track moves sideways with the vertical scroll.
 *
 * The section grows tall enough to scroll through the whole track, the track
 * sticks to the top of the viewport, and its horizontal shift follows the
 * page scroll. Outside `media`, with reduced motion or without JavaScript,
 * the section is left to your CSS (for example a native horizontal scroll).
 * Returns `{ active, progress, refresh, destroy }`.
 */
export function horizontalScroll(
  section: Element | string,
  options: HorizontalScrollOptions = {}
): HorizontalScroll {
  if (!isBrowser()) return inert
  const host = resolveElements(section)[0] as HTMLElement | undefined
  if (!host) return inert

  const findTrack = (): HTMLElement | null => {
    const { track } = options
    if (track instanceof Element) return track as HTMLElement
    return (host.querySelector(track ?? `[${TRACK_ATTRIBUTE}]`) ??
      (track ? null : host.firstElementChild)) as HTMLElement | null
  }

  const topOption = readString(host, 'data-horizontal-scroll-top', '') || (options.top ?? 0)
  const speedValue = readNumber(host, 'data-horizontal-scroll-speed', options.speed ?? 1)
  const speed = speedValue > 0 ? speedValue : 1
  const media = readString(host, 'data-horizontal-scroll-media', options.media ?? '')
  const respectReducedMotion = options.respectReducedMotion ?? true
  const followFocus = readBoolean(host, 'data-horizontal-scroll-focus', options.followFocus ?? true)

  const root = (options.root ?? null) as HTMLElement | null
  const scroller: HTMLElement | Window = root ?? window
  const query = media && typeof window.matchMedia === 'function' ? window.matchMedia(media) : null
  const [clipName, clipValue] = clipProperty()

  let track: HTMLElement | null = null
  let active = false
  let progress = 0
  let distance = 0
  let length = 0
  let top = 0
  let frame = 0
  let resizeObserver: ResizeObserver | null = null
  const saved = new Map<HTMLElement, Array<[string, string, string]>>()

  const save = (element: HTMLElement, names: string[]) => {
    saved.set(
      element,
      names.map(name => [
        name,
        element.style.getPropertyValue(name),
        element.style.getPropertyPriority(name),
      ])
    )
  }

  const restore = () => {
    saved.forEach((entries, element) => {
      for (const [name, value, priority] of entries) {
        if (value) element.style.setProperty(name, value, priority)
        else element.style.removeProperty(name)
      }
    })
    saved.clear()
  }

  const wanted = () =>
    !!findTrack() &&
    (query ? query.matches : true) &&
    !(respectReducedMotion && prefersReducedMotion())

  /** Size the section so the page scrolls exactly through the track. */
  const measure = () => {
    if (!active || !track) return
    top = resolveLength(topOption, root ? root.clientHeight : window.innerHeight)
    // Content overflowing the track, or a track wider than the section (`width: max-content`).
    distance = Math.max(
      0,
      track.scrollWidth - track.clientWidth,
      track.offsetWidth - host.clientWidth
    )
    length = distance / speed
    host.style.setProperty('height', `${track.offsetHeight + length}px`)
    track.style.setProperty('top', `${top}px`)
    update()
  }

  /** The section's top relative to the top edge of the scrollport. */
  const offsetTop = () =>
    host.getBoundingClientRect().top -
    (root ? root.getBoundingClientRect().top + root.clientTop : 0)

  const update = () => {
    frame = 0
    if (!active || !track) return
    const next = length > 0 ? clamp((top - offsetTop()) / length) : 0
    const x = -distance * next
    track.style.setProperty('translate', `${x}px 0`)
    host.style.setProperty(PROGRESS_PROPERTY, String(Math.round(next * 10000) / 10000))
    if (next === progress) return
    progress = next
    options.onProgress?.({ progress, x, distance })
  }

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update)
  }

  const onResize = () => measure()

  /** Bring a focused element of the track into view by scrolling the page (or `root`). */
  const onFocus = (event: Event) => {
    if (!active || !track || !distance) return
    const target = event.target as Element
    if (!track.contains(target) || target === track) return
    const view = host.getBoundingClientRect()
    const box = target.getBoundingClientRect()
    const x = distance * progress
    let shift = x
    if (box.left < view.left) shift = x + box.left - view.left
    else if (box.right > view.right) shift = x + box.right - view.right
    if (shift === x) return
    const goal = clamp(shift / distance)
    const scrolled = root ? root.scrollTop : window.scrollY
    scroller.scrollTo({
      top: scrolled + offsetTop() - top + goal * length,
      behavior: 'instant' as ScrollBehavior,
    })
    update()
  }

  const enable = () => {
    track = findTrack()
    if (!track || active) return
    active = true
    save(host, ['height', clipName, PROGRESS_PROPERTY])
    save(track, ['position', 'top', 'translate', 'will-change'])
    host.style.setProperty(clipName, clipValue)
    track.style.setProperty('position', 'sticky')
    track.style.setProperty('will-change', 'translate')
    host.setAttribute(STATE_ATTRIBUTE, 'active')

    scroller.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', onResize)
    if (followFocus) host.addEventListener('focusin', onFocus)
    if (typeof ResizeObserver === 'function') {
      // The track's own box rarely changes size; its children do (images, fonts).
      resizeObserver = new ResizeObserver(() => measure())
      resizeObserver.observe(track)
      for (const child of track.children) resizeObserver.observe(child)
      if (root) resizeObserver.observe(root)
    }
    measure()
  }

  const disable = () => {
    if (!active) return
    active = false
    scroller.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', onResize)
    host.removeEventListener('focusin', onFocus)
    resizeObserver?.disconnect()
    resizeObserver = null
    cancelAnimationFrame(frame)
    frame = 0
    restore()
    host.setAttribute(STATE_ATTRIBUTE, 'inactive')
    if (progress !== 0) {
      progress = 0
      options.onProgress?.({ progress, x: 0, distance })
    }
  }

  const sync = () => (wanted() ? enable() : disable())

  query?.addEventListener('change', sync)
  const stopMotion = respectReducedMotion ? onReducedMotionChange(sync) : noop
  if (wanted()) enable()
  else host.setAttribute(STATE_ATTRIBUTE, 'inactive')

  let destroyed = false
  return {
    get active() {
      return active
    },
    get progress() {
      return progress
    },
    refresh: () => {
      if (destroyed) return
      if (active && findTrack() !== track) disable()
      sync()
      measure()
    },
    destroy: () => {
      if (destroyed) return
      destroyed = true
      query?.removeEventListener('change', sync)
      stopMotion()
      disable()
      host.removeAttribute(STATE_ATTRIBUTE)
    },
  }
}

/**
 * Set up every `[data-horizontal-scroll]` section in `scope`, including ones
 * added later, and clean up ones that are removed. Returns a controller with
 * `refresh()` and `destroy()`.
 */
export function autoHorizontalScroll({
  selector = `[${ATTRIBUTE}]`,
  scope,
  observe = true,
  ...options
}: AutoHorizontalScrollOptions = {}): AutoInitController {
  return autoInit({
    selector,
    observe,
    ...(scope && { root: scope }),
    init: element => horizontalScroll(element, options).destroy,
  })
}
