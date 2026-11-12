import { observeVisibility } from '../core/observe.js'
import { isVisible } from '../vanilla/index.js'

const api = { observe: isVisible, isVisible, observeVisibility }

export type IsVisibleGlobal = typeof api

const scope = globalThis as typeof globalThis & {
  IsVisible?: IsVisibleGlobal
  isVisible?: typeof isVisible
}

scope.IsVisible = api
scope.isVisible = isVisible

export { isVisible, observeVisibility }
