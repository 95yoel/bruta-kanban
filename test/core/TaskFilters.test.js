import { matchesTaskFilters } from '../../src/core/task-filters.js'

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

test('matches tasks by query and status filters', () => {
  const task = {
    title: 'Preparar demo',
    description: 'Montar el tablero',
    status: 'planificada'
  }

  assert(matchesTaskFilters(task, { query: 'demo', status: '' }) === true, 'Expected query match')
  assert(matchesTaskFilters(task, { query: '', status: 'planificada' }) === true, 'Expected status match')
  assert(matchesTaskFilters(task, { query: '', status: 'completada' }) === false, 'Expected status mismatch')
})
