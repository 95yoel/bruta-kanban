/**
 * TaskDetailDialog shows the selected task and exposes secondary actions
 * such as edit, delete, and mark as completed.
 */
import { formatDateTime, formatElapsedTime } from '../../core/formatters.js'
import { AppButton } from '../buttons/app-button.js'
import { renderTaskDetailDialogLayout } from './task-detail-dialog.template.js'

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

    contentRoot.innerHTML = renderTaskDetailDialogLayout({
      title: task.title,
      description: task.description || 'Sin descripcion',
      status: task.status,
      createdAt: formatDateTime(task.createdAt),
      startedAt: formatDateTime(task.startedAt),
      elapsedTime: formatElapsedTime(task.elapsedSeconds),
      completedAt: formatDateTime(task.completedAt),
      closeButton: new AppButton({ label: 'Cerrar', variant: 'ghost', className: 'js-close-detail-dialog' }).render(),
      editButton: new AppButton({ label: 'Editar', variant: 'ghost', className: 'js-edit-detail-task' }).render(),
      deleteButton: new AppButton({ label: 'Eliminar', variant: 'ghost', className: 'js-delete-detail-task' }).render(),
      completeButton: new AppButton({ label: 'Marcar completada', className: 'js-complete-detail-task' }).render()
    })

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
