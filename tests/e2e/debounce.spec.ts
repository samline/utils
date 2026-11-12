import { expect, test } from './fixtures'

test('rafThrottle coalesces bursts into one call per frame', async ({ load }) => {
  const page = await load('<div></div>', 'debounce')

  const result = await page.evaluate(
    () =>
      new Promise<{ calls: number; last: number }>(resolve => {
        const { rafThrottle } = (window as any).Debounce
        let calls = 0
        let last = -1
        const handler = rafThrottle((value: number) => {
          calls++
          last = value
        })
        for (let i = 0; i < 100; i++) handler(i)
        requestAnimationFrame(() => requestAnimationFrame(() => resolve({ calls, last })))
      })
  )

  expect(result).toEqual({ calls: 1, last: 99 })
})

test('debounce and throttle keep their timing with real timers', async ({ load }) => {
  const page = await load('<div></div>', 'debounce')

  const result = await page.evaluate(async () => {
    const { debounce, throttle } = (window as any).Debounce
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
    let debounced = 0
    let throttled = 0
    const d = debounce(() => debounced++, 40)
    const t = throttle(() => throttled++, 40)
    for (let i = 0; i < 10; i++) {
      d()
      t()
      await sleep(10)
    }
    await sleep(120)
    return { debounced, throttled }
  })

  expect(result.debounced).toBe(1)
  expect(result.throttled).toBeGreaterThanOrEqual(2)
  expect(result.throttled).toBeLessThanOrEqual(5)
})
