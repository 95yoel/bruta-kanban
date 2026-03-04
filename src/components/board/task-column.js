import { TaskCard } from './task-card.js'

export class TaskColumn {
  constructor({ status, tasks }) {
    this.status = status
    this.tasks = tasks
  }

  renderContent() {
    if (this.tasks.length === 0) {
      return '<p class="board-column__empty">Sin tareas en esta columna</p>'
    }

    return this.tasks.map(task => new TaskCard(task).render()).join('')
  }

  render() {
    return `
      <section class="board-column">
        <header class="board-column__header">
          <h2 class="board-column__title">${this.status}</h2>
          <span class="board-column__count">${this.tasks.length}</span>
        </header>
        <div class="board-column__list">
          ${this.renderContent()}
        </div>
      </section>
    `
  }
}
