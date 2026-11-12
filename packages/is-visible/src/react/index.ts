import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type RefCallback,
} from 'react'

import { observeState, type VisibilityState, type VisibilityStateOptions } from '../core/state.js'

export * from '../core/index.js'

export type UseIsVisibleOptions = VisibilityStateOptions

export interface UseIsVisibleResult<TElement extends Element = Element> extends VisibilityState {
  /** Attach to the element to observe. */
  ref: RefCallback<TElement>
}

const configKey = ({ root, rootMargin, threshold, once, options }: UseIsVisibleOptions) =>
  JSON.stringify([rootMargin, threshold, once, options?.rootMargin, options?.threshold]) +
  (root ? '#root' : '')

/**
 * Track whether an element is visible.
 * Callbacks always read their latest value; the observer is recreated only
 * when the element or the observation settings change.
 */
export function useIsVisible<TElement extends Element = HTMLElement>(
  options: UseIsVisibleOptions = {}
): UseIsVisibleResult<TElement> {
  const optionsRef = useRef(options)
  optionsRef.current = options

  const [element, setElement] = useState<TElement | null>(null)
  const [state, setState] = useState<VisibilityState>({
    isVisible: options.initialValue ?? false,
    entry: null,
  })

  const key = configKey(options)
  const root = options.root

  useEffect(() => {
    if (!element) return
    const current = optionsRef.current
    return observeState(
      element,
      {
        ...current,
        visible: (entry, el) => optionsRef.current.visible?.(entry, el),
        notVisible: (entry, el) => optionsRef.current.notVisible?.(entry, el),
      },
      setState
    )
    // `key` and `root` capture every setting that requires a new observer.
  }, [element, key, root])

  return { ...state, ref: setElement as RefCallback<TElement> }
}

type OwnProps = UseIsVisibleOptions & {
  as?: ElementType
  children?: ReactNode | ((state: VisibilityState) => ReactNode)
}

export type VisibilityObserverProps<TElement extends ElementType = 'div'> = OwnProps &
  Omit<ComponentPropsWithoutRef<TElement>, keyof OwnProps | 'ref'>

export type VisibilityObserverState = VisibilityState

/** Renders `as` (default `div`) and passes `{ isVisible, entry }` to a render-prop child. */
export function VisibilityObserver<TElement extends ElementType = 'div'>({
  as,
  children,
  initialValue,
  inOut,
  notVisible,
  once,
  options,
  root,
  rootMargin,
  threshold,
  visible,
  fallback,
  ...elementProps
}: VisibilityObserverProps<TElement>) {
  const { ref, ...state } = useIsVisible({
    ...(initialValue !== undefined && { initialValue }),
    ...(inOut !== undefined && { inOut }),
    ...(notVisible !== undefined && { notVisible }),
    ...(once !== undefined && { once }),
    ...(options !== undefined && { options }),
    ...(root !== undefined && { root }),
    ...(rootMargin !== undefined && { rootMargin }),
    ...(threshold !== undefined && { threshold }),
    ...(visible !== undefined && { visible }),
    ...(fallback !== undefined && { fallback }),
  })
  const content = typeof children === 'function' ? children(state) : children
  return createElement(as ?? 'div', { ...elementProps, ref }, content)
}
