import { TextArea } from '../../../src/components/inputs/text-area.js'

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

test('renders textarea markup with the configured rows and placeholder', () => {
  const input = new TextArea({
    label: 'Descripcion',
    name: 'description',
    placeholder: 'Describe la tarea',
    rows: 6
  })

  const markup = input.render()

  assert(markup.includes('<textarea'), 'The component should render a textarea element')
  assert(markup.includes('rows="6"'), 'The textarea should render the configured row count')
  assert(markup.includes('placeholder="Describe la tarea"'), 'The textarea should render its placeholder')
})
