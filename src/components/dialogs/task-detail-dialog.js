import { formatElapsedTime } from '../board/task-board.js'

const formatDate = value => {
  if (!value) {
    return 'No disponible'
  }

  return new Date(value).toLocaleString('es-ES')
}

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
        <button class="button button-ghost js-close-detail-dialog" type="button">Cerrar</button>
      </header>
      <div class="detail-grid">
        <p class="detail-row"><span class="detail-label">Descripcion</span>${task.description || 'Sin descripcion'}</p>
        <p class="detail-row"><span class="detail-label">Estado</span>${task.status}</p>
        <p class="detail-row"><span class="detail-label">Creada</span>${formatDate(task.createdAt)}</p>
        <p class="detail-row"><span class="detail-label">Inicio</span>${formatDate(task.startedAt)}</p>
        <p class="detail-row"><span class="detail-label">Tiempo</span>${formatElapsedTime(task.elapsedSeconds)}</p>
        <p class="detail-row"><span class="detail-label">Finalizada</span>${formatDate(task.completedAt)}</p>
      </div>
    `

    const closeButton = contentRoot.querySelector('.js-close-detail-dialog')

    closeButton.addEventListener('click', () => {
      this.root.close()
    })
  }
}
