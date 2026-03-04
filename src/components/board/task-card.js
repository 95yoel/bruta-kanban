import { AppButton } from '../buttons/app-button.js'

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

export class TaskCard {
  constructor(task) {
    this.task = task
  }

  renderMoveButton(status) {
    const button = new AppButton({
      label: status,
      variant: 'ghost',
      className: 'js-move-task',
      attributes: {
        'data-task-id': this.task.id,
        'data-next-status': status
      }
    })

    return button.render()
  }

  render() {
    return `
      <article class="task-card">
        <button class="task-card__main js-open-task" data-task-id="${this.task.id}" type="button">
          <span class="task-card__eyebrow">${this.task.status}</span>
          <strong class="task-card__title">${this.task.title}</strong>
          <span class="task-card__text">${this.task.description}</span>
          <span class="task-card__meta">Tiempo: ${formatElapsedTime(this.task.elapsedSeconds)}</span>
        </button>
        <div class="task-card__actions">
          ${STATUSES
            .filter(status => status !== this.task.status)
            .map(status => this.renderMoveButton(status))
            .join('')}
        </div>
      </article>
    `
  }
}

export { STATUSES, formatElapsedTime }
