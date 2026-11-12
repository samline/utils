import { get, writable, type Writable } from 'svelte/store'

import { debounce } from '../core/debounce.js'

export * from '../core/index.js'

export interface DebouncedStore<T> extends Writable<T> {
  /** Write the pending value now. */
  flush: () => void
  /** Drop the pending value. */
  cancel: () => void
}

/**
 * A writable store whose `set` and `update` land after `wait` ms of quiet.
 * `update` reads the latest pending value, so chained updates are not lost.
 */
export const createDebouncedStore = <T>(initialValue: T, wait: number): DebouncedStore<T> => {
  const store = writable(initialValue)
  let pendingValue: { value: T } | undefined

  const commit = debounce(() => {
    if (!pendingValue) return
    store.set(pendingValue.value)
    pendingValue = undefined
  }, wait)

  const set = (value: T) => {
    pendingValue = { value }
    commit()
  }

  return {
    subscribe: store.subscribe,
    set,
    update: updater => set(updater(pendingValue ? pendingValue.value : get(store))),
    flush: () => {
      commit.flush()
    },
    cancel: () => {
      commit.cancel()
      pendingValue = undefined
    },
  }
}
