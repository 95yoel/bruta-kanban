import { renderTaskColumnLayout } from '../../../src/components/board/task-column.template.js'

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

test('renders a column layout with title, count and content markup', () => {
  const markup = renderTaskColumnLayout({
    status: 'planificada',
    count: 3,
    contentMarkup: '<article>Tarea</article>'
  })

  assert(markup.includes('planificada'), 'The column template should render the status title')
  assert(markup.includes('>3<'), 'The column template should render the item count')
  assert(markup.includes('<article>Tarea</article>'), 'The column template should include the provided content')
})
