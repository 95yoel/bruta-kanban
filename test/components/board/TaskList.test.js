import { TaskList } from '../../../src/components/board/task-list.js'

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

test('renders the empty state when there are no tasks', () => {
  const markup = new TaskList([]).render()
  assert(markup.includes('Sin tareas en esta columna'), 'Expected the list to render the empty state')
})

test('renders task cards when tasks exist', () => {
  const markup = new TaskList([
    {
      id: 'task-1',
      title: 'Crear modulo',
      description: 'Separar la lista interna',
      status: 'planificada',
      elapsedSeconds: 5
    }
  ]).render()

  assert(markup.includes('Crear modulo'), 'Expected the list to render the task title')
})
