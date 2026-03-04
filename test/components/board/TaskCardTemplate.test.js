import { renderTaskCardLayout } from '../../../src/components/board/task-card.template.js'

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

test('renders the structural layout for a task card', () => {
  const markup = renderTaskCardLayout({
    status: 'planificada',
    title: 'Preparar estructura',
    description: 'Separar los bloques del tablero',
    time: '20s',
    actionMarkup: '<button>Ver detalle</button>'
  })

  assert(markup.includes('Preparar estructura'), 'The template should render the title')
  assert(markup.includes('Tiempo: 20s'), 'The template should render the time label')
  assert(markup.includes('<button>Ver detalle</button>'), 'The template should include the provided action markup')
})
