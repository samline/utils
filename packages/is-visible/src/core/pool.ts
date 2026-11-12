/**
 * Shared IntersectionObservers.
 *
 * One observer per distinct (root, rootMargin, threshold) is created and
 * reused by every subscription with the same configuration, instead of one
 * observer per element. Elements are observed while at least one subscription
 * needs them and the observer is disconnected when nothing is left.
 */

export type EntryHandler = (entry: IntersectionObserverEntry) => void

interface PoolEntry {
  observer: IntersectionObserver
  handlers: Map<Element, Set<EntryHandler>>
}

export interface ObserverConfig {
  root: Element | Document | null
  rootMargin: string
  threshold: number[]
}

const DOCUMENT_ROOT = {}
let pools = new WeakMap<object, Map<string, PoolEntry>>()
const live = new Set<PoolEntry>()

const keyOf = ({ rootMargin, threshold }: ObserverConfig) => `${rootMargin}|${threshold.join(',')}`

const getPool = (root: ObserverConfig['root']) => {
  const rootKey = root ?? DOCUMENT_ROOT
  let pool = pools.get(rootKey)
  if (!pool) {
    pool = new Map()
    pools.set(rootKey, pool)
  }
  return pool
}

const createEntry = (config: ObserverConfig, pool: Map<string, PoolEntry>, key: string) => {
  const handlers = new Map<Element, Set<EntryHandler>>()
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        // Copy: a handler may unsubscribe itself (`once`) while we iterate.
        const set = handlers.get(entry.target)
        if (set) Array.from(set).forEach(handler => handler(entry))
      }
    },
    { root: config.root, rootMargin: config.rootMargin, threshold: config.threshold }
  )
  const poolEntry: PoolEntry = { observer, handlers }
  pool.set(key, poolEntry)
  live.add(poolEntry)
  return poolEntry
}

/** Subscribe `handler` to `element`'s intersection changes. Returns an unsubscribe. */
export const subscribe = (
  element: Element,
  config: ObserverConfig,
  handler: EntryHandler
): (() => void) => {
  const pool = getPool(config.root)
  const key = keyOf(config)
  const poolEntry = pool.get(key) ?? createEntry(config, pool, key)

  let set = poolEntry.handlers.get(element)
  if (!set) {
    set = new Set()
    poolEntry.handlers.set(element, set)
    poolEntry.observer.observe(element)
  }
  set.add(handler)

  let active = true
  return () => {
    if (!active) return
    active = false
    set!.delete(handler)
    if (set!.size > 0) return
    poolEntry.handlers.delete(element)
    poolEntry.observer.unobserve(element)
    if (poolEntry.handlers.size === 0) {
      poolEntry.observer.disconnect()
      live.delete(poolEntry)
      pool.delete(key)
    }
  }
}

/** Number of live observers. Exposed for tests and debugging only. */
export const countObservers = (root: ObserverConfig['root'] = null): number =>
  pools.get(root ?? DOCUMENT_ROOT)?.size ?? 0

/** Disconnect every shared observer. For tests and hot-module reloads only. */
export const resetObservers = (): void => {
  live.forEach(entry => entry.observer.disconnect())
  live.clear()
  pools = new WeakMap()
}
