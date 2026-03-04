import { TextInput } from '../inputs/text-input.js'

export class TaskDialog {
  constructor({ root, bus }) {
    this.root = root
    this.bus = bus
  }

  mount() {
    const fieldsRoot = this.root.querySelector('.js-task-form-fields')
    const openButton = document.querySelector('.js-open-create-dialog')
    const closeButtons = this.root.querySelectorAll('.js-close-create-dialog')
    const form = this.root.querySelector('.js-task-form')

    const titleInput = new TextInput({
      label: 'Titulo',
      name: 'title',
      placeholder: 'Escribe una tarea clara'
    })

    const descriptionInput = new TextInput({
      label: 'Descripcion',
      name: 'description',
      placeholder: 'Resume el trabajo a realizar'
    })

    fieldsRoot.innerHTML = `${titleInput.render()}${descriptionInput.render()}`

    openButton.addEventListener('click', () => {
      this.root.showModal()
    })

    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.root.close())
    })

    form.addEventListener('submit', event => {
      event.preventDefault()

      const formData = new FormData(form)
      const title = String(formData.get('title') || '').trim()
      const description = String(formData.get('description') || '').trim()

      if (!title) {
        return
      }

      this.bus.emit('task:create', {
        id: crypto.randomUUID(),
        title,
        description,
        status: 'planificada',
        createdAt: new Date().toISOString(),
        startedAt: '',
        completedAt: '',
        elapsedSeconds: 0
      })

      form.reset()
      this.root.close()
    })
  }
}
