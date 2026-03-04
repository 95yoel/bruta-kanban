import { AppButton } from '../buttons/app-button.js'
import { TextArea } from '../inputs/text-area.js'
import { TextInput } from '../inputs/text-input.js'

export class TaskDialog {
  constructor({ root, bus }) {
    this.root = root
    this.bus = bus
    this.editingTaskId = null
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
      this.editingTaskId = null
      form.reset()
      this.root.querySelector('.dialog-title').textContent = 'Crear tarea'
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

      if (this.editingTaskId) {
        this.bus.emit('task:update', {
          taskId: this.editingTaskId,
          title,
          description
        })
      } else {
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
      }

      this.editingTaskId = null
      form.reset()
      this.root.querySelector('.dialog-title').textContent = 'Crear tarea'
      this.root.close()
    })

    this.bus.on('task:edit-request', task => {
      this.editingTaskId = task.id
      this.root.querySelector('.dialog-title').textContent = 'Editar tarea'
      form.elements.title.value = task.title
      form.elements.description.value = task.description
      this.root.showModal()
    })
  }
}
