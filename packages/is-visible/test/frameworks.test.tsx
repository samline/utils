import { act, render, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { get } from 'svelte/store'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'

import * as react from '../src/react/index.js'
import * as svelte from '../src/svelte/index.js'
import * as vue from '../src/vue/index.js'
import { el, emit, installMock } from './helpers.js'

beforeEach(() => {
  installMock()
})

afterEach(() => {
  document.body.innerHTML = ''
  vi.unstubAllGlobals()
})

describe('react', () => {
  it('tracks visibility and forwards the latest callbacks', () => {
    const target = el()
    const visible = vi.fn()
    const notVisible = vi.fn()
    const { result, rerender } = renderHook(
      ({ cb }) => react.useIsVisible({ visible: cb, notVisible, inOut: true }),
      { initialProps: { cb: vi.fn() } }
    )

    act(() => result.current.ref(target))
    rerender({ cb: visible })

    act(() => emit(target, true))
    expect(result.current.isVisible).toBe(true)
    expect(result.current.entry?.target).toBe(target)
    expect(visible).toHaveBeenCalledTimes(1)

    act(() => emit(target, false))
    expect(result.current.isVisible).toBe(false)
    expect(notVisible).toHaveBeenCalledTimes(1)
  })

  it('turns false on leave even without inOut, but keeps notVisible silent', () => {
    const target = el()
    const notVisible = vi.fn()
    const { result } = renderHook(() =>
      react.useIsVisible({ notVisible, initialValue: false, root: null })
    )
    act(() => result.current.ref(target))
    act(() => emit(target, true))
    act(() => emit(target, false))
    expect(result.current.isVisible).toBe(false)
    expect(notVisible).not.toHaveBeenCalled()
  })

  it('renders VisibilityObserver with a render prop', () => {
    const { container } = render(
      createElement(react.VisibilityObserver, {
        as: 'section',
        id: 'box',
        initialValue: false,
        inOut: true,
        once: false,
        threshold: 0,
        rootMargin: '0px',
        options: {},
        root: null,
        fallback: 'visible',
        visible: vi.fn(),
        notVisible: vi.fn(),
        children: (state: react.VisibilityObserverState) => (state.isVisible ? 'in' : 'out'),
      })
    )
    const box = container.querySelector('#box')!
    expect(box.textContent).toBe('out')
    act(() => emit(box, true))
    expect(box.textContent).toBe('in')

    const plain = render(createElement(react.VisibilityObserver, null, 'static'))
    expect(plain.container.textContent).toBe('static')
  })
})

describe('vue', () => {
  it('tracks visibility through the composable and component', async () => {
    const visible = vi.fn()
    const host = el()
    let exposed: ReturnType<typeof vue.useIsVisible> | undefined

    const Probe = defineComponent({
      setup() {
        exposed = vue.useIsVisible(() => ({ inOut: true, visible }))
        return () => h('div', { ref: exposed!.target, id: 'probe' })
      },
    })

    const slot = ref('')
    const app = createApp({
      render: () => [
        h(Probe),
        h(
          vue.VisibilityObserver,
          {
            as: 'section',
            id: 'comp',
            inOut: true,
            rootMargin: '0px',
            threshold: 0,
            options: {},
            visible: vi.fn(),
            notVisible: vi.fn(),
          },
          { default: (s: vue.VisibilityObserverState) => (slot.value = s.isVisible ? 'in' : 'out') }
        ),
      ],
    })
    app.mount(host)
    await nextTick()

    const probe = host.querySelector('#probe')!
    emit(probe, true)
    expect(exposed!.isVisible.value).toBe(true)
    expect(visible).toHaveBeenCalledTimes(1)
    emit(probe, false)
    expect(exposed!.isVisible.value).toBe(false)

    const comp = host.querySelector('#comp')!
    emit(comp, true)
    await nextTick()
    expect(slot.value).toBe('in')
    app.unmount()

    // No options at all.
    const bare = vue.useIsVisible()
    expect(bare.isVisible.value).toBe(false)
  })
})

describe('svelte', () => {
  it('syncs stores through the action and supports update and destroy', () => {
    const node = el()
    const { action, isVisible, entry } = svelte.useIsVisible({ initialValue: false })
    const handle = action(node)

    emit(node, true)
    expect(get(isVisible)).toBe(true)
    expect(get(entry)?.target).toBe(node)

    handle.update?.({ threshold: 0.5 })
    expect(get(isVisible)).toBe(false)
    emit(node, true, 1)
    expect(get(isVisible)).toBe(true)

    handle.update?.(undefined)
    handle.destroy?.()

    const other = el()
    const only = svelte.createVisibilityAction()
    only(other, { inOut: true }).destroy?.()
    svelte.useIsVisible().action(other).destroy?.()
  })
})
