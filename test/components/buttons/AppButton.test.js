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

test('renders an icon button in compact mode', () => {
  const button = new AppButton({
    label: 'Editar',
    variant: 'ghost',
    className: 'js-edit-task',
    iconSrc: './src/assets/icons/pencil.png',
    iconAlt: '',
    compact: true
  })

  const markup = button.render()

  assert(markup.includes('button-compact'), 'The button should render the compact class')
  assert(markup.includes('button__icon'), 'The button should render an icon element')
  assert(markup.includes('pencil.png'), 'The button should render the configured icon source')
})
