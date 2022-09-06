import { resolve } from 'path'
import { testAssistant } from '@sketch-hq/sketch-assistant-utils'

import Assistant from '..'

test('test assistant', async () => {
  const {
    // violations,
    ruleErrors
  } = await testAssistant(
    resolve(__dirname, './my-test.sketch'),
    Assistant,
  )
  // expect(violations[0]?.message || '不在规范色中').toContain('不在规范色中')
  expect(ruleErrors).toHaveLength(0)
})
