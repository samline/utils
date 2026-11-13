---
name: debounce
description: Use @samline/debounce to debounce, throttle or frame-throttle JavaScript handlers with cancel, flush and pending, in vanilla JS, React, Vue, Svelte or plain HTML.
package-version: '1.0.1'
---

# @samline/debounce

Build against the installed version; this skill describes 1.0.1.

- **Install:** `npm install @samline/debounce`. Plain HTML: load `https://cdn.jsdelivr.net/npm/@samline/debounce@1.0.1/dist/browser/debounce.global.js` and use `window.Debounce`.
- **Pick the tool:** `debounce(fn, wait, { leading, trailing, maxWait })` when only the final call matters; `throttle(fn, wait, { leading, trailing })` for a steady rate; `rafThrottle(fn)` for scroll, pointer and layout work.
- **Controls:** every returned function forwards `this`, returns the last result and has `cancel()`, `flush()` and `pending()`. Call `cancel()` on teardown and `flush()` before submit.
- **Frameworks:** `@samline/debounce/react` (`useDebouncedCallback`, `useThrottledCallback`, `useDebouncedValue`), `/vue` (`useDebouncedCallback`, `useThrottledCallback`, `useDebouncedRef`), `/svelte` (`createDebouncedStore`). They cancel automatically.
- **Do not** wrap the package in your own timers, and do not create a new debounced function on every render or event.
