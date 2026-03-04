import { normalizeTask } from '../../src/services/indexeddb-service.js'

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

test('normalizes missing task fields with safe defaults', () => {
  const task = normalizeTask({
    title: 'Tarea parcial'
  })

  assert(task.title === 'Tarea parcial', 'The title should be preserved')
  assert(task.status === 'planificada', 'The status should default to planificada')
  assert(task.elapsedSeconds === 0, 'The elapsed time should default to zero')
  assert(task.order === 0, 'The task order should default to zero')
  assert(typeof task.id === 'string' && task.id.length > 0, 'The task should receive an id')
})
