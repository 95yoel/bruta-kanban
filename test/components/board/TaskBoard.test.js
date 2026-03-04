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
  assert(markup.includes('Ver detalle'), 'Expected the card to render a detail action')
  assert(markup.includes('Editar'), 'Expected the card to render an edit action')
  assert(markup.includes('data-next-status="en desarrollo"'), 'Expected a move action for in-progress status')
  assert(markup.includes('Eliminar'), 'Expected the card to render a delete action')
  assert(markup.includes('Tiempo: 30s'), 'Expected the elapsed time label')
})
