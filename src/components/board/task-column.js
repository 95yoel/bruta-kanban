import { TaskList } from './task-list.js'
import { renderTaskColumnLayout } from './task-column.template.js'

export class TaskColumn {
  constructor({ status, tasks }) {
    this.status = status
    this.tasks = tasks
  }

  renderContent() {
    return new TaskList(this.tasks).render()
  }

  render() {
    return renderTaskColumnLayout({
      status: this.status,
      count: this.tasks.length,
      contentMarkup: this.renderContent()
    })
  }
}
