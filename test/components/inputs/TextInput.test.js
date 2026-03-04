import { TextInput } from '../../../src/components/inputs/text-input.js'

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

test('renders label, name and placeholder for the text input', () => {
  const input = new TextInput({
    label: 'Titulo',
    name: 'title',
    placeholder: 'Escribe una tarea'
  })

  const markup = input.render()

  assert(markup.includes('Titulo'), 'The input should render its label')
  assert(markup.includes('name="title"'), 'The input should render the configured name')
  assert(markup.includes('placeholder="Escribe una tarea"'), 'The input should render its placeholder')
})
