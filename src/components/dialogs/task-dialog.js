import { AppButton } from '../buttons/app-button.js'
import { TextArea } from '../inputs/text-area.js'
import { TextInput } from '../inputs/text-input.js'

export class TaskDialog {
  constructor({ root, bus }) {
    this.root = root
    this.bus = bus
  }

  mount() {
    const fieldsRoot = this.root.querySelector('.js-task-form-fields')
    const openButton = document.querySelector('.js-open-create-dialog')
    const form = this.root.querySelector('.js-task-form')
    const footer = this.root.querySelector('.dialog-footer')

    const titleInput = new TextInput({
      label: 'Titulo',
      name: 'title',
      placeholder: 'Escribe una tarea clara'
    })

    const descriptionInput = new TextArea({
      label: 'Descripcion',
      name: 'description',
      placeholder: 'Resume el trabajo a realizar'
    })

    fieldsRoot.innerHTML = `${titleInput.render()}${descriptionInput.render()}`
    footer.innerHTML = `
      ${new AppButton({ label: 'Cancelar', variant: 'ghost', className: 'js-close-create-dialog' }).render()}
      ${new AppButton({ label: 'Guardar tarea', type: 'submit' }).render()}
    `

    openButton.addEventListener('click', () => {
      this.root.showModal()
    })

    this.root.querySelectorAll('.js-close-create-dialog').forEach(button => {
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
