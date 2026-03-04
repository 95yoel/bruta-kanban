import { formatDateTime, formatElapsedTime } from '../../src/core/formatters.js'

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

test('formats elapsed time in seconds', () => {
  assert(formatElapsedTime(9) === '9s', 'Expected second-based formatting')
})

test('formats empty dates as unavailable', () => {
  assert(formatDateTime('') === 'No disponible', 'Expected fallback text for empty dates')
})
