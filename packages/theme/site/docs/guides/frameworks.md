---
title: Frameworks
description: Use @samline/theme in React, Vue, Svelte, Astro and Next.js, with the head snippet for no flash and the controller in your components.
locale: en
sidebar:
  group: guides
  order: 2
---

Create one controller for the page and share it. Apply the theme in `<head>` first, with the CDN script or `themeScript()`, so nothing flashes before your bundle runs.

## React

```jsx
import { createTheme } from '@samline/theme'
import { useSyncExternalStore } from 'react'

export const theme = createTheme()

export function useTheme() {
  return useSyncExternalStore(
    theme.subscribe,
    () => theme.theme,
    () => 'light'
  )
}

export function ThemeToggle() {
  const current = useTheme()
  return (
    <button type="button" aria-pressed={current === 'dark'} onClick={theme.toggle}>
      Dark mode
    </button>
  )
}
```

## Next.js

```jsx
import { themeScript } from '@samline/theme'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript() }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

Create the controller in a client component.

## Vue

```vue
<script setup>
import { createTheme } from '@samline/theme'
import { onBeforeUnmount, ref } from 'vue'

const theme = createTheme()
const current = ref(theme.theme)
const stop = theme.subscribe(state => (current.value = state.theme))
onBeforeUnmount(stop)
</script>
```

## Svelte

```svelte
<script>
  import { createTheme } from '@samline/theme'
  import { readable } from 'svelte/store'

  const theme = createTheme()
  const current = readable(theme.theme, set => theme.subscribe(state => set(state.theme)))
</script>

<button type="button" on:click={theme.toggle}>{$current}</button>
```

## Astro

```astro
---
import { themeScript } from '@samline/theme'
---

<head>
  <script is:inline data-astro-rerun set:html={themeScript()} />
</head>

<script>
  import { createTheme } from '@samline/theme'

  createTheme()
</script>
```

With view transitions, `<html>` attributes are replaced on each navigation; `data-astro-rerun` runs the snippet again after every swap. The controller's listeners are on `document` and `window`, so they keep working.
