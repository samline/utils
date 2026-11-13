import * as api from '../core/index.js'

export type SamlineStringGlobal = typeof api

;(globalThis as typeof globalThis & { SamlineString?: SamlineStringGlobal }).SamlineString = api

export * from '../core/index.js'
