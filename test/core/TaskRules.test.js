import { canTransitionTask, isValidStatus } from '../../src/core/task-rules.js'

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

test('accepts known statuses only', () => {
  assert(isValidStatus('planificada') === true, 'Expected a known status to be valid')
  assert(isValidStatus('archivada') === false, 'Expected an unknown status to be invalid')
})

test('allows defined transitions only', () => {
  assert(canTransitionTask('planificada', 'en desarrollo') === true, 'Expected a valid forward move')
  assert(canTransitionTask('completada', 'en desarrollo') === false, 'Expected an invalid reverse move')
  assert(canTransitionTask('planificada', 'planificada') === false, 'Expected same-state moves to be rejected')
})
