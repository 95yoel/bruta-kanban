import { formatDateTime, formatElapsedTime } from '../../core/formatters.js'
import { AppButton } from '../buttons/app-button.js'

export class TaskDetailDialog {
  constructor({ root, bus, store }) {
    this.root = root
    this.bus = bus
    this.store = store
  }

  open() {
    this.render()
    this.root.showModal()
  }

  mount() {
    this.store.subscribe(() => {
      if (this.root.open) {
        this.render()
      }
    })
  }

  getSelectedTask() {
    const state = this.store.getState()
    return state.tasks.find(task => task.id === state.selectedTaskId)
  }

  render() {
    const task = this.getSelectedTask()
    const contentRoot = this.root.querySelector('.js-task-detail-content')

    if (!task) {
      contentRoot.innerHTML = ''
      return
    }

    contentRoot.innerHTML = `
      <header class="dialog-header">
        <h2 class="dialog-title">${task.title}</h2>
        ${new AppButton({ label: 'Cerrar', variant: 'ghost', className: 'js-close-detail-dialog' }).render()}
      </header>
      <div class="detail-grid">
        <p class="detail-row"><span class="detail-label">Descripcion</span>${task.description || 'Sin descripcion'}</p>
        <p class="detail-row"><span class="detail-label">Estado</span>${task.status}</p>
        <p class="detail-row"><span class="detail-label">Creada</span>${formatDateTime(task.createdAt)}</p>
        <p class="detail-row"><span class="detail-label">Inicio</span>${formatDateTime(task.startedAt)}</p>
        <p class="detail-row"><span class="detail-label">Tiempo</span>${formatElapsedTime(task.elapsedSeconds)}</p>
        <p class="detail-row"><span class="detail-label">Finalizada</span>${formatDateTime(task.completedAt)}</p>
      </div>
      <div class="dialog-footer">
        ${new AppButton({ label: 'Editar', variant: 'ghost', className: 'js-edit-detail-task' }).render()}
        ${new AppButton({ label: 'Eliminar', variant: 'ghost', className: 'js-delete-detail-task' }).render()}
        ${new AppButton({ label: 'Marcar completada', className: 'js-complete-detail-task' }).render()}
      </div>
    `

    const closeButton = contentRoot.querySelector('.js-close-detail-dialog')
    const editButton = contentRoot.querySelector('.js-edit-detail-task')
    const deleteButton = contentRoot.querySelector('.js-delete-detail-task')
    const completeButton = contentRoot.querySelector('.js-complete-detail-task')

    closeButton.addEventListener('click', () => {
      this.root.close()
    })

    editButton.addEventListener('click', () => {
      this.bus.emit('task:edit-request', task)
      this.root.close()
    })

    deleteButton.addEventListener('click', () => {
      this.bus.emit('task:delete', task.id)
      this.root.close()
    })

    completeButton.addEventListener('click', () => {
      this.bus.emit('task:move', {
        taskId: task.id,
        nextStatus: 'completada'
      })
      this.root.close()
    })
  }
}
