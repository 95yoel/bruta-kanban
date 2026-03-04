import { AppButton } from '../../../src/components/buttons/app-button.js'

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

test('renders a ghost button with custom classes and data attributes', () => {
  const button = new AppButton({
    label: 'Mover',
    variant: 'ghost',
    className: 'js-move-task',
    attributes: {
      'data-task-id': 'task-1'
    }
  })

  const markup = button.render()

  assert(markup.includes('button-ghost'), 'The button should render its ghost variant class')
  assert(markup.includes('js-move-task'), 'The button should render the provided custom class')
  assert(markup.includes('data-task-id="task-1"'), 'The button should render the provided data attribute')
})
