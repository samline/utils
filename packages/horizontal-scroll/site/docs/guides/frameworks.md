---
title: 'Framework integrations'
titleAccent: 'integrations'
description: Use @samline/horizontal-scroll in React, Vue, Svelte and Astro, and keep it working with client-side navigation and page swaps.
locale: en
sidebar:
  group: guides
  order: 3
---

`horizontalScroll` returns an object with `destroy()`, so it fits every framework's mount and unmount hooks. Changes in size are picked up on their own; call `refresh()` after replacing the track element.

## React

```jsx
import { horizontalScroll } from '@samline/horizontal-scroll'
import { useEffect, useRef } from 'react'

export function Gallery({ items }) {
  const section = useRef(null)

  useEffect(() => {
    const scroller = horizontalScroll(section.current, { top: 64 })
    return () => scroller.destroy()
  }, [])

  return (
    <section ref={section} className="gallery">
      <div data-horizontal-scroll-track className="row">
        {items.map(item => (
          <article key={item.id} className="card" tabIndex={0}>
            {item.title}
          </article>
        ))}
      </div>
    </section>
  )
}
```

## Vue

```vue
<script setup>
import { horizontalScroll } from '@samline/horizontal-scroll'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const section = ref(null)
let scroller

onMounted(() => (scroller = horizontalScroll(section.value)))
onBeforeUnmount(() => scroller?.destroy())
</script>

<template>
  <section ref="section">
    <div data-horizontal-scroll-track class="row"><slot /></div>
  </section>
</template>
```

## Svelte

```svelte
<script>
  import { horizontalScroll } from '@samline/horizontal-scroll'

  const pin = node => {
    const scroller = horizontalScroll(node)
    return { destroy: scroller.destroy }
  }
</script>

<section use:pin>
  <div data-horizontal-scroll-track class="row"><slot /></div>
</section>
```

## Astro

```astro
<section data-horizontal-scroll>
  <div data-horizontal-scroll-track class="row"><slot /></div>
</section>

<script>
  import { autoHorizontalScroll } from '@samline/horizontal-scroll'

  autoHorizontalScroll()
</script>
```

`autoHorizontalScroll` watches the page, so sections added or removed by client-side navigation (Astro view transitions, swup, Turbo or htmx) are set up and cleaned up on their own. With view transitions that replace the whole body, start it once from a module script; it keeps watching the new body.
