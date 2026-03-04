import { sanitizeImportedTasks } from '../../src/core/task-import.js'

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

test('sanitizes imported tasks and fills required fields', () => {
  const tasks = sanitizeImportedTasks([
    {
      description: 'Sin titulo'
    }
  ])

  assert(tasks.length === 1, 'Expected one sanitized task')
  assert(tasks[0].title === 'Tarea importada 1', 'Expected a fallback title')
  assert(typeof tasks[0].id === 'string' && tasks[0].id.length > 0, 'Expected a generated id')
})
