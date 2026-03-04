import { STATUSES } from './task-card.js'
import { TaskColumn } from './task-column.js'

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

  renderColumn(status) {
    return new TaskColumn({
      status,
      tasks: this.getTasksByStatus(status)
    }).render()
  }

  bindEvents() {
    this.root.querySelectorAll('.js-open-task').forEach(button => {
      button.addEventListener('click', () => {
        this.bus.emit('task:select', button.dataset.taskId)
      })
    })

    this.root.querySelectorAll('.js-edit-task').forEach(button => {
      button.addEventListener('click', () => {
        const task = this.store.getState().tasks.find(item => item.id === button.dataset.taskId)

        if (task) {
          this.bus.emit('task:edit-request', task)
        }
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

    this.root.querySelectorAll('.js-delete-task').forEach(button => {
      button.addEventListener('click', () => {
        this.bus.emit('task:delete', button.dataset.taskId)
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
