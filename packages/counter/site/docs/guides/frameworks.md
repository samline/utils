---
title: Frameworks
description: Use @samline/counter in React, Vue, Svelte and Astro, and keep it working with client-side navigation and page swaps.
locale: en
sidebar:
  group: guides
  order: 2
---

`counter` returns a cleanup that also restores the original text, so it fits every framework's mount and unmount hooks. Render the final value; the counter replaces it only while animating.

## React

```jsx
import { counter } from '@samline/counter'
import { useEffect, useRef } from 'react'

export function Stat({ value, label }) {
  const number = useRef(null)
  useEffect(() => counter(number.current, { to: value }), [value])
  return (
    <p>
      <span ref={number}>{value.toLocaleString()}</span> {label}
    </p>
  )
}
```

## Vue

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { counter } from '@samline/counter'

const props = defineProps({ value: Number })
const number = ref()
let stop
onMounted(() => (stop = counter(number.value, { to: props.value })))
onBeforeUnmount(() => stop?.())
</script>

<template>
  <span ref="number">{{ value.toLocaleString() }}</span>
</template>
```

## Svelte

```svelte
<script>
  import { counter } from '@samline/counter'

  export let value
  const count = (node, to) => ({ destroy: counter(node, { to }) })
</script>

<span use:count={value}>{value.toLocaleString()}</span>
```

## Astro, page swaps and AJAX

For a page built from many components, call `autoCounter()` once. It watches the document, so it counts numbers added later (infinite scroll, AJAX, Swup or Astro view transitions that replace the content) and releases removed ones. The CDN script does the same.

```astro
<p><span data-counter="12480">12,480</span> customers</p>

<script>
  import { autoCounter } from '@samline/counter'

  autoCounter()
</script>
```

Server rendering is safe: on the server `counter` and `autoCounter` return no-ops, and the rendered value is visible until the script runs.
