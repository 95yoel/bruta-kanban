import { formatElapsedTime } from '../../../src/components/board/task-board.js'

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

test('formats elapsed time in seconds when under one minute', () => {
  assert(formatElapsedTime(12) === '12s', 'Expected seconds format for short durations')
})

test('formats elapsed time in minutes and seconds under one day', () => {
  assert(formatElapsedTime(135) === '2m 15s', 'Expected minutes and seconds format')
})

test('formats elapsed time in hours over one day', () => {
  assert(formatElapsedTime(90000) === '25h', 'Expected hours format for long durations')
})
