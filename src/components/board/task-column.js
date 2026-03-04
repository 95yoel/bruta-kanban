import { TaskCard } from './task-card.js'
import { renderTaskColumnLayout } from './task-column.template.js'

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
    return renderTaskColumnLayout({
      status: this.status,
      count: this.tasks.length,
      contentMarkup: this.renderContent()
    })
  }
}
