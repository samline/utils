---
title: 'Framework integrations'
titleAccent: 'integrations'
description: Use @samline/is-visible in React with useIsVisible, in Vue with a composable and in Svelte with an action.
locale: en
sidebar:
  group: guides
  order: 2
---

Each adapter is a subpath and re-exports the root API. In every adapter `isVisible` turns `false` when the element leaves, even without `inOut`; your `notVisible` callback still runs only with `inOut`.

## React

```jsx
import { useIsVisible, VisibilityObserver } from '@samline/is-visible/react'

const { ref, isVisible, entry } = useIsVisible({ threshold: 0.5 })
return <section ref={ref}>{isVisible ? 'In view' : 'Out of view'}</section>
```

Callbacks always read their latest value; the observer is recreated only when the element or the observation settings change. `<VisibilityObserver as="section" once>{({ isVisible }) => …}</VisibilityObserver>` renders a wrapper.

## Vue

```js
import { useIsVisible } from '@samline/is-visible/vue'

const { target, isVisible } = useIsVisible({ once: true })
```

Bind `ref="target"` in the template. Options may be a ref or a getter. `<VisibilityObserver>` passes `{ isVisible, entry }` to its default slot.

## Svelte

```svelte
<script>
  import { useIsVisible } from '@samline/is-visible/svelte'
  const { action, isVisible } = useIsVisible({ threshold: 0.5 })
</script>

<section use:action>{$isVisible ? 'In view' : 'Out of view'}</section>
```
