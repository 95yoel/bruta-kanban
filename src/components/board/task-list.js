import { TaskCard } from './task-card.js'

export class TaskList {
  constructor(tasks) {
    this.tasks = tasks
  }

  render() {
    if (this.tasks.length === 0) {
      return '<p class="board-column__empty">Sin tareas en esta columna</p>'
    }

    return this.tasks.map(task => new TaskCard(task).render()).join('')
  }
}
