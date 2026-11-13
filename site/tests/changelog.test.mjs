import assert from 'node:assert/strict'
import test from 'node:test'
import { withoutEmptyUnreleased } from '../shared/lib/changelog.mjs'

test('drops an empty Unreleased section and its compare link', () => {
  const source =
    '## [Unreleased]\n\n## [1.0.0] - 2026-01-01\n\n- First.\n\n[Unreleased]: https://x/compare/v1.0.0...HEAD\n[1.0.0]: https://x/v1.0.0\n'
  assert.equal(
    withoutEmptyUnreleased(source),
    '## [1.0.0] - 2026-01-01\n\n- First.\n\n[1.0.0]: https://x/v1.0.0\n'
  )
  assert.equal(withoutEmptyUnreleased('## Unreleased\n'), '')
})

test('keeps Unreleased notes that have content', () => {
  const source = '## [Unreleased]\n\n- Pending.\n\n## [1.0.0]\n\n[Unreleased]: https://x\n'
  assert.equal(withoutEmptyUnreleased(source), source)
})
