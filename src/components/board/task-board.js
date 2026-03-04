const STATUSES = ['planificada', 'en desarrollo', 'completada']

const formatElapsedTime = elapsedSeconds => {
  if (elapsedSeconds < 60) {
    return `${elapsedSeconds}s`
  }

  if (elapsedSeconds < 86400) {
    const minutes = Math.floor(elapsedSeconds / 60)
    const seconds = elapsedSeconds % 60
    return `${minutes}m ${seconds}s`
  }

  const hours = Math.floor(elapsedSeconds / 3600)
  return `${hours}h`
}

export class TaskBoard {
  constructor({ root, bus, store }) {
    this.root = root
    this.bus = bus
    this.store = store
    this.unsubscribe = null
  }

  mount() {
    this.unsubscribe = this.store.subscribe(() => {
      this.render()
    })

    this.render()
  }

  getTasksByStatus(status) {
    return this.store.getState().tasks.filter(task => task.status === status)
  }

  renderTaskCard(task) {
    return `
      <article class="task-card">
        <button class="task-card__main js-open-task" data-task-id="${task.id}" type="button">
          <span class="task-card__eyebrow">${task.status}</span>
          <strong class="task-card__title">${task.title}</strong>
          <span class="task-card__text">${task.description}</span>
          <span class="task-card__meta">Tiempo: ${formatElapsedTime(task.elapsedSeconds)}</span>
        </button>
        <div class="task-card__actions">
          ${STATUSES.filter(status => status !== task.status).map(status => `
            <button
              class="button button-ghost js-move-task"
              data-task-id="${task.id}"
              data-next-status="${status}"
              type="button"
            >
              ${status}
            </button>
          `).join('')}
        </div>
      </article>
    `
  }

  renderColumn(status) {
    const tasks = this.getTasksByStatus(status)

    return `
      <section class="board-column">
        <header class="board-column__header">
          <h2 class="board-column__title">${status}</h2>
          <span class="board-column__count">${tasks.length}</span>
        </header>
        <div class="board-column__list">
          ${tasks.length > 0
            ? tasks.map(task => this.renderTaskCard(task)).join('')
            : '<p class="board-column__empty">Sin tareas en esta columna</p>'}
        </div>
      </section>
    `
  }

  bindEvents() {
    this.root.querySelectorAll('.js-open-task').forEach(button => {
      button.addEventListener('click', () => {
        this.bus.emit('task:select', button.dataset.taskId)
      })
    })

    this.root.querySelectorAll('.js-move-task').forEach(button => {
      button.addEventListener('click', () => {
        this.bus.emit('task:move', {
          taskId: button.dataset.taskId,
          nextStatus: button.dataset.nextStatus
        })
      })
    })
  }

  render() {
    this.root.innerHTML = `
      <div class="board-grid">
        ${STATUSES.map(status => this.renderColumn(status)).join('')}
      </div>
    `

    this.bindEvents()
  }
}

export { formatElapsedTime }
