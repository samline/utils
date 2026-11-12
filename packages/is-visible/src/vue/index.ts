import {
  defineComponent,
  h,
  ref,
  shallowRef,
  toValue,
  watchEffect,
  type Component,
  type MaybeRefOrGetter,
  type PropType,
  type Ref,
  type ShallowRef,
} from 'vue'

import { observeState, type VisibilityState, type VisibilityStateOptions } from '../core/state.js'

export * from '../core/index.js'

export type UseIsVisibleOptions = VisibilityStateOptions

export interface UseIsVisibleResult<TElement extends Element = HTMLElement> {
  /** Bind with `ref="target"` in the template. */
  target: ShallowRef<TElement | null>
  isVisible: Ref<boolean>
  entry: ShallowRef<IntersectionObserverEntry | null>
}

/** Track whether `target` is visible. Options may be a ref or getter. */
export function useIsVisible<TElement extends Element = HTMLElement>(
  optionsSource: MaybeRefOrGetter<UseIsVisibleOptions | undefined> = {}
): UseIsVisibleResult<TElement> {
  const target = shallowRef<TElement | null>(null) as ShallowRef<TElement | null>
  const entry = shallowRef<IntersectionObserverEntry | null>(null)
  const isVisible = ref(toValue(optionsSource)?.initialValue ?? false)

  watchEffect(onCleanup => {
    const options = toValue(optionsSource) ?? {}
    const element = target.value
    if (!element) return

    onCleanup(
      observeState(element, options, state => {
        isVisible.value = state.isVisible
        entry.value = state.entry
      })
    )
  })

  return { target, isVisible, entry }
}

export type VisibilityObserverState = VisibilityState

/** Renders `as` (default `div`) and passes `{ isVisible, entry }` to the default slot. */
export const VisibilityObserver = defineComponent({
  name: 'VisibilityObserver',
  props: {
    as: { type: [String, Object, Function] as PropType<string | Component>, default: 'div' },
    initialValue: { type: Boolean, default: false },
    inOut: { type: Boolean, default: false },
    once: { type: Boolean, default: false },
    rootMargin: { type: String, default: undefined },
    threshold: { type: [Number, Array] as PropType<number | number[]>, default: undefined },
    options: { type: Object as PropType<IntersectionObserverInit>, default: undefined },
    visible: { type: Function as PropType<UseIsVisibleOptions['visible']>, default: undefined },
    notVisible: {
      type: Function as PropType<UseIsVisibleOptions['notVisible']>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    const { target, isVisible, entry } = useIsVisible(() => {
      const options: UseIsVisibleOptions = {
        initialValue: props.initialValue,
        inOut: props.inOut,
        once: props.once,
      }
      if (props.rootMargin !== undefined) options.rootMargin = props.rootMargin
      if (props.threshold !== undefined) options.threshold = props.threshold
      if (props.options !== undefined) options.options = props.options
      if (props.visible !== undefined) options.visible = props.visible
      if (props.notVisible !== undefined) options.notVisible = props.notVisible
      return options
    })

    return () =>
      h(
        props.as,
        { ...attrs, ref: target },
        slots.default?.({ isVisible: isVisible.value, entry: entry.value })
      )
  },
})
