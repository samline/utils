---
title: Frameworks
description: Use @samline/reveal in React, Vue, Svelte and Astro, and keep it working with client-side navigation and page swaps.
locale: en
sidebar:
  group: guides
  order: 3
---

`reveal` returns a cleanup, so it fits every framework's mount and unmount hooks. Import the stylesheet once, for example in your app entry.

## React

```jsx
import '@samline/reveal/style.css'
import { reveal } from '@samline/reveal'
import { useEffect, useRef } from 'react'

export function Features({ items }) {
  const list = useRef(null)
  useEffect(() => reveal(list.current.children, { stagger: 80 }), [items])
  return (
    <ul ref={list}>
      {items.map(item => (
        <li key={item.id} data-reveal>{item.title}</li>
      ))}
    </ul>
  )
}
```

## Vue

```vue
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { reveal } from '@samline/reveal'

const list = ref()
let stop
onMounted(() => (stop = reveal(list.value.children, { stagger: 80 })))
onBeforeUnmount(() => stop?.())
</script>
```

## Svelte

```svelte
<script>
  import { reveal } from '@samline/reveal'

  const revealChildren = node => ({ destroy: reveal(node.children, { stagger: 80 }) })
</script>

<ul use:revealChildren>…</ul>
```

## Astro, page swaps and AJAX

For a page built from many components, call `autoReveal()` once. It watches the document, so it reveals elements added later (infinite scroll, AJAX, Swup or Astro view transitions that replace the content) and releases removed ones. The CDN script does the same.

```astro
<script>
  import '@samline/reveal/style.css'
  import { autoReveal } from '@samline/reveal'

  autoReveal()
</script>
```

Server rendering is safe: on the server `reveal` and `autoReveal` return no-ops, and server HTML is visible until the script runs, so there is no blank first paint.
