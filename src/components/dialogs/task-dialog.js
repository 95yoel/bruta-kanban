/**
 * TaskDialog owns the create/edit form.
 * It validates user input, then emits domain events instead of saving directly.
 */
import { AppButton } from '../buttons/app-button.js'
import { createId } from '../../core/id.js'
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
    const errorRoot = document.createElement('p')

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

    errorRoot.className = 'form-feedback js-task-form-feedback'
    errorRoot.hidden = true

    fieldsRoot.innerHTML = `${titleInput.render()}${descriptionInput.render()}`
    fieldsRoot.appendChild(errorRoot)
    footer.innerHTML = `
      ${new AppButton({ label: 'Cancelar', variant: 'ghost', className: 'js-close-create-dialog' }).render()}
      ${new AppButton({ label: 'Guardar tarea', type: 'submit' }).render()}
    `

    openButton.addEventListener('click', () => {
      this.editingTaskId = null
      form.reset()
      errorRoot.hidden = true
      errorRoot.textContent = ''
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
        errorRoot.hidden = false
        errorRoot.textContent = 'El titulo es obligatorio'
        return
      }

      if (title.length > 80) {
        errorRoot.hidden = false
        errorRoot.textContent = 'El titulo no puede superar 80 caracteres'
        return
      }

      if (description.length > 240) {
        errorRoot.hidden = false
        errorRoot.textContent = 'La descripcion no puede superar 240 caracteres'
        return
      }

      errorRoot.hidden = true
      errorRoot.textContent = ''

      if (this.editingTaskId) {
        this.bus.emit('task:update', {
          taskId: this.editingTaskId,
          title,
          description
        })
      } else {
        this.bus.emit('task:create', {
          id: createId(),
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
      errorRoot.hidden = true
      errorRoot.textContent = ''
      this.root.querySelector('.dialog-title').textContent = 'Editar tarea'
      form.elements.title.value = task.title
      form.elements.description.value = task.description
      this.root.showModal()
    })
  }
}
