/**
 * TaskList renders the ordered cards inside one column plus the drop zones
 * used by drag and drop to insert tasks at a precise position.
 */
import { TaskCard } from './task-card.js'

export class TaskList {
  constructor(tasks, status) {
    this.tasks = tasks
    this.status = status
  }

  renderDropZone(index) {
    return `
      <div
        class="task-drop-zone js-task-drop-zone"
        data-status="${this.status}"
        data-target-index="${index}"
        aria-hidden="true"
      ></div>
    `
  }

  render() {
    if (this.tasks.length === 0) {
      return `
        ${this.renderDropZone(0)}
        <p class="board-column__empty">Sin tareas en esta columna</p>
      `
    }

    return this.tasks.map((task, index) => (
      `${this.renderDropZone(index)}${new TaskCard(task).render()}`
    )).join('') + this.renderDropZone(this.tasks.length)
  }
}
