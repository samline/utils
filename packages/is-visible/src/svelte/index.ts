import { writable, type Readable } from 'svelte/store'

import { observeState, type VisibilityStateOptions } from '../core/state.js'

export * from '../core/index.js'

export type UseIsVisibleOptions = VisibilityStateOptions

export interface VisibilityActionReturn<TParameter> {
  update?: (parameter: TParameter) => void
  destroy?: () => void
}

export type VisibilityAction<TElement extends Element, TParameter> = (
  node: TElement,
  parameter?: TParameter
) => VisibilityActionReturn<TParameter>

export interface UseIsVisibleResult<TElement extends Element = HTMLElement> {
  /** `use:action` or `use:action={options}`. */
  action: VisibilityAction<TElement, UseIsVisibleOptions | undefined>
  isVisible: Readable<boolean>
  entry: Readable<IntersectionObserverEntry | null>
}

/** Stores plus an action that keeps them in sync with the node's visibility. */
export function useIsVisible<TElement extends Element = HTMLElement>(
  initialOptions: UseIsVisibleOptions = {}
): UseIsVisibleResult<TElement> {
  const isVisible = writable(initialOptions.initialValue ?? false)
  const entry = writable<IntersectionObserverEntry | null>(null)

  const action: VisibilityAction<TElement, UseIsVisibleOptions | undefined> = (node, parameter) => {
    let stop = () => {}
    const start = (options: UseIsVisibleOptions = initialOptions) => {
      stop()
      stop = observeState(node, options, state => {
        isVisible.set(state.isVisible)
        entry.set(state.entry)
      })
    }

    start(parameter)

    return {
      update: next => start(next),
      destroy: () => stop(),
    }
  }

  return {
    action,
    isVisible: { subscribe: isVisible.subscribe },
    entry: { subscribe: entry.subscribe },
  }
}

/** Shortcut when only the action is needed. */
export const createVisibilityAction = <TElement extends Element = HTMLElement>(
  options: UseIsVisibleOptions = {}
) => useIsVisible<TElement>(options).action
