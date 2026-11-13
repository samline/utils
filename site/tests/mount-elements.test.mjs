import test from 'node:test'
import assert from 'node:assert/strict'

// Minimal DOM stand-ins: mount-elements only needs querySelectorAll, matches,
// isConnected, dataset and a MutationObserver it can register.
const element = name => ({ name, isConnected: true, dataset: {}, matches: () => false })
const elements = [element('first'), element('broken'), element('last')]
globalThis.HTMLElement = function HTMLElement() {}
globalThis.MutationObserver = function MutationObserver() {
  return { observe() {} }
}
globalThis.document = {
  documentElement: {},
  querySelectorAll: () => elements,
}

test('one failing setup does not stop later elements from mounting', async () => {
  const errors = []
  const original = console.error
  console.error = (...args) => errors.push(args)
  try {
    const { mountElements } = await import('../shared/lib/mount-elements.ts')
    const mounted = []
    mountElements('[data-demo]', item => {
      if (item.name === 'broken') throw new Error('broken preview')
      mounted.push(item.name)
    })
    assert.deepEqual(mounted, ['first', 'last'])
    assert.equal(elements[2].dataset.mounted, 'true')
    assert.equal(elements[1].dataset.mounted, undefined)
    assert.equal(errors.length, 1)
    assert.match(String(errors[0][0]), /\[data-demo\]/)
  } finally {
    console.error = original
  }
})
