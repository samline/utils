---
title: Frameworks
description: Use @samline/debounce in React with hooks, in Vue with composables and in Svelte with a debounced store.
locale: en
sidebar:
  group: guides
  order: 1
---

Each adapter is a subpath and re-exports the root API.

## React

```jsx
import { useDebouncedCallback, useDebouncedValue } from '@samline/debounce/react'

const search = useDebouncedCallback(query => fetchResults(query), 300)
const debouncedQuery = useDebouncedValue(query, 300)
```

The returned function is stable and always calls the latest callback. It is recreated only when `wait` or an option changes, and cancelled on unmount. `useThrottledCallback` works the same way with throttle semantics.

## Vue

```js
import { useDebouncedCallback, useDebouncedRef } from '@samline/debounce/vue'

const search = useDebouncedCallback(query => fetchResults(query), 300)
const debouncedQuery = useDebouncedRef(query, 300)
```

Pending calls are cancelled when the effect scope is disposed.

## Svelte

```js
import { createDebouncedStore } from '@samline/debounce/svelte'

const query = createDebouncedStore('', 300)
query.set('pear') // lands after 300 ms of quiet
query.flush() // or now
```

Chained `update` calls see the latest pending value.
