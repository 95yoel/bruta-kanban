/**
 * TaskCard converts one task object into a visual card with all its actions.
 * It does not handle events directly; it only prepares the markup.
 */
import { AppButton } from '../buttons/app-button.js'
import { formatElapsedTime } from '../../core/formatters.js'
import { renderTaskCardLayout } from './task-card.template.js'

const STATUSES = ['planificada', 'en desarrollo', 'completada']

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
        'data-next-status': status,
        title: `Mover a ${status}`
      }
    })

    return button.render()
  }

  render() {
    const openButton = new AppButton({
      label: 'Ver detalle',
      variant: 'ghost',
      className: 'js-open-task task-card__action-button',
      iconSrc: './src/assets/icons/info.svg',
      iconAlt: '',
      compact: true,
      attributes: {
        'data-task-id': this.task.id,
        'aria-label': 'Ver detalle',
        title: 'Ver detalle'
      }
    })

    const editButton = new AppButton({
      label: 'Editar',
      variant: 'ghost',
      className: 'js-edit-task task-card__action-button',
      iconSrc: './src/assets/icons/pencil.png',
      iconAlt: '',
      compact: true,
      attributes: {
        'data-task-id': this.task.id,
        'aria-label': 'Editar',
        title: 'Editar'
      }
    })

    const deleteButton = new AppButton({
      label: 'Eliminar',
      variant: 'ghost',
      className: 'js-delete-task task-card__action-button',
      iconSrc: './src/assets/icons/delete.png',
      iconAlt: '',
      compact: true,
      attributes: {
        'data-task-id': this.task.id,
        'aria-label': 'Eliminar',
        title: 'Eliminar'
      }
    })

    const actionMarkup = [
      openButton.render(),
      editButton.render(),
      ...STATUSES
        .filter(status => status !== this.task.status)
        .map(status => this.renderMoveButton(status)),
      deleteButton.render()
    ].join('')

    return renderTaskCardLayout({
      id: this.task.id,
      status: this.task.status,
      title: this.task.title,
      description: this.task.description,
      time: formatElapsedTime(this.task.elapsedSeconds),
      actionMarkup
    })
  }
}

export { STATUSES, formatElapsedTime }
