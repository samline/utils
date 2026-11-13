---
title: Frameworks
description: Use @samline/scroll-spy in React, Vue, Svelte and Astro, and keep it working with client-side navigation and page swaps.
locale: en
sidebar:
  group: guides
  order: 2
---

`scrollSpy` returns an object with `destroy()`, so it fits every framework's mount and unmount hooks. Call `refresh()` when the headings change.

## React

```jsx
import { scrollSpy } from '@samline/scroll-spy'
import { useEffect, useRef, useState } from 'react'

export function Toc({ headings }) {
  const nav = useRef(null)
  const [active, setActive] = useState(null)
  useEffect(() => {
    const spy = scrollSpy(nav.current, { onChange: ({ id }) => setActive(id) })
    return spy.destroy
  }, [headings])
  return (
    <nav ref={nav} aria-label="On this page">
      {headings.map(h => (
        <a key={h.id} href={`#${h.id}`}>{h.text}</a>
      ))}
    </nav>
  )
}
```

`aria-current` is set on the links directly; keep `active` in state only when something else needs it.

## Vue

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { scrollSpy } from '@samline/scroll-spy'

const nav = ref()
let spy
onMounted(() => (spy = scrollSpy(nav.value)))
onBeforeUnmount(() => spy?.destroy())
</script>
```

## Svelte

```svelte
<script>
  import { scrollSpy } from '@samline/scroll-spy'

  const spy = node => ({ destroy: scrollSpy(node).destroy })
</script>

<nav use:spy aria-label="On this page">…</nav>
```

## Astro, page swaps and AJAX

Mark the navigation with `data-scroll-spy` and call `autoScrollSpy()` once. It watches the document, so navigations added by Swup, Astro view transitions or AJAX are picked up and removed ones are released. The CDN script does the same.

```astro
<nav data-scroll-spy aria-label="On this page">
  {headings.map(h => <a href={`#${h.slug}`}>{h.text}</a>)}
</nav>

<script>
  import { autoScrollSpy } from '@samline/scroll-spy'

  autoScrollSpy()
</script>
```

Server rendering is safe: on the server `scrollSpy` returns an inert object, and the links work as plain anchors until the script runs.
