import { getAdjustedTargetIndex } from '../../../src/components/board/task-board.js'
import { TaskCard, formatElapsedTime } from '../../../src/components/board/task-card.js'

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

test('adjusts the drop index when reordering downward inside one column', () => {
  const correctedIndex = getAdjustedTargetIndex([
    { id: 'task-1' },
    { id: 'task-2' },
    { id: 'task-3' }
  ], 'task-1', 2)

  assert(correctedIndex === 1, 'Expected downward reorder to compensate for removing the dragged task first')
})

test('produces the correct index when dropping a card onto the card below it', () => {
  // Simulates the column handler logic: drop on card at cardIndex=2 (below source
  // at sourceIndex=1) → targetIndex = cardIndex + 1 = 3, then corrected to 2.
  const visibleTasks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const sourceIndex = visibleTasks.findIndex(task => task.id === 'b') // 1
  const cardIndex = 2 // the card 'c' that was dropped on
  const targetIndex = cardIndex > sourceIndex ? cardIndex + 1 : cardIndex // 3
  const correctedIndex = getAdjustedTargetIndex(visibleTasks, 'b', targetIndex)

  assert(correctedIndex === 2, 'Expected b to land after c when dropped anywhere on c moving downward')
})

test('produces the correct index when dropping a card onto the card above it', () => {
  // Simulates the column handler logic: drop on card at cardIndex=0 (above source
  // at sourceIndex=2) → targetIndex = cardIndex = 0, corrected stays 0.
  const visibleTasks = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]
  const sourceIndex = visibleTasks.findIndex(task => task.id === 'c') // 2
  const cardIndex = 0 // the card 'a' that was dropped on
  const targetIndex = cardIndex > sourceIndex ? cardIndex + 1 : cardIndex // 0
  const correctedIndex = getAdjustedTargetIndex(visibleTasks, 'c', targetIndex)

  assert(correctedIndex === 0, 'Expected c to land before a when dropped on a moving upward')
})

test('renders a task card with title and move buttons', () => {
  const card = new TaskCard({
    id: 'task-1',
    title: 'Crear tablero',
    description: 'Montar la primera columna del kanban',
    status: 'planificada',
    elapsedSeconds: 30
  })

  const markup = card.render()

  assert(markup.includes('Crear tablero'), 'Expected the card to render the task title')
  assert(markup.includes('aria-label="Ver detalle"'), 'Expected the card to render a detail action')
  assert(markup.includes('title="Ver detalle"'), 'Expected the detail button tooltip')
  assert(markup.includes('aria-label="Editar"'), 'Expected the card to render an edit action')
  assert(markup.includes('title="Editar"'), 'Expected the edit button tooltip')
  assert(markup.includes('data-next-status="en desarrollo"'), 'Expected a move action for in-progress status')
  assert(markup.includes('title="Mover a en desarrollo"'), 'Expected the move button tooltip')
  assert(markup.includes('aria-label="Eliminar"'), 'Expected the card to render a delete action')
  assert(markup.includes('title="Eliminar"'), 'Expected the delete button tooltip')
  assert(markup.includes('info.svg'), 'Expected the card to render the info icon')
  assert(markup.includes('Tiempo: 30s'), 'Expected the elapsed time label')
})
