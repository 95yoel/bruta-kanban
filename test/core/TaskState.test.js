import { applyTaskMove, createInitialTasks, getNextOrder, normalizeOrdering } from '../../src/core/task-state.js'

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

test('creates a valid initial task set for an empty database', () => {
  const tasks = createInitialTasks()

  assert(tasks.length === 1, 'Expected one initial task')
  assert(tasks[0].status === 'planificada', 'Expected the initial task to start as planificada')
  assert(typeof tasks[0].id === 'string' && tasks[0].id.length > 0, 'Expected the initial task to have an id')
})

test('moves a task to another status and keeps ordering stable', () => {
  const tasks = normalizeOrdering([
    { id: 'a', title: 'A', description: '', status: 'planificada', elapsedSeconds: 0, order: 0, startedAt: '', completedAt: '' },
    { id: 'b', title: 'B', description: '', status: 'planificada', elapsedSeconds: 0, order: 1, startedAt: '', completedAt: '' }
  ])

  const result = applyTaskMove(tasks, 'a', 'en desarrollo', 0)

  assert(result.moved === true, 'Expected the move to be accepted')
  assert(result.tasks.find(task => task.id === 'a').status === 'en desarrollo', 'Expected the task status to change')
  assert(result.tasks.find(task => task.id === 'a').startedAt !== '', 'Expected startedAt to be filled')
})

test('returns a safe next order value for new tasks', () => {
  const nextOrder = getNextOrder([{ order: 2 }, { order: 7 }])
  assert(nextOrder === 8, 'Expected the next order to continue after the highest value')
})
