import { renderTaskDetailDialogLayout } from '../../../src/components/dialogs/task-detail-dialog.template.js'

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

test('renders the detail dialog layout with actions', () => {
  const markup = renderTaskDetailDialogLayout({
    title: 'Crear tablero',
    description: 'Separar componentes',
    status: 'en desarrollo',
    createdAt: 'hoy',
    startedAt: 'ahora',
    elapsedTime: '10s',
    completedAt: 'No disponible',
    closeButton: '<button>Cerrar</button>',
    editButton: '<button>Editar</button>',
    deleteButton: '<button>Eliminar</button>',
    completeButton: '<button>Completar</button>'
  })

  assert(markup.includes('Crear tablero'), 'The template should render the task title')
  assert(markup.includes('Separar componentes'), 'The template should render the description')
  assert(markup.includes('<button>Editar</button>'), 'The template should include the edit action')
})
