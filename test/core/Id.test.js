import { createId } from '../../src/core/id.js'

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const test = (name, callback) => {
  try {
    callback()
    console.log(`PASS: ${name}`)
  } catch (error) {
    console.error(`FAIL: ${name}`)
    console.error(error.message)
  }
}

test('creates a UUID-like identifier without randomUUID', () => {
  const value = createId()

  assert(typeof value === 'string', 'Expected a string identifier')
  assert(/^[a-f0-9-]{36}$/i.test(value), 'Expected a UUID-like 36 character format')
})
