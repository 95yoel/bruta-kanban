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

test('renders drop zones before and after tasks', () => {
  const markup = new TaskList([
    {
      id: 'task-1',
      title: 'Crear modulo',
      description: 'Separar la lista interna',
      status: 'planificada',
      elapsedSeconds: 5
    }
  ], 'planificada').render()

  const dropZoneMatches = markup.match(/js-task-drop-zone/g) || []
  assert(dropZoneMatches.length === 2, 'Expected one drop zone before and one after a single task')
})
