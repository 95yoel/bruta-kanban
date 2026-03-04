/**
 * TaskBoard renders the visible kanban and translates user interactions
 * (clicks, drag and drop) into domain events sent through the bus.
 */
import { STATUSES } from './task-card.js'
import { TaskColumn } from './task-column.js'

export const getAdjustedTargetIndex = (visibleTasks, taskId, targetIndex) => {
  const sourceIndex = visibleTasks.findIndex(task => task.id === taskId)

  if (sourceIndex === -1) {
    return targetIndex
  }

  if (targetIndex > sourceIndex) {
    return targetIndex - 1
  }

  return targetIndex
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
    const { tasks, filters } = this.store.getState()
    const normalizedQuery = filters.query.trim().toLowerCase()

    return tasks
      .filter(task => task.status === status)
      .filter(task => {
        if (filters.status && task.status !== filters.status) {
          return false
        }

        if (!normalizedQuery) {
          return true
        }

        const haystack = `${task.title} ${task.description}`.toLowerCase()
        return haystack.includes(normalizedQuery)
      })
      .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
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

    this.root.querySelectorAll('.task-card[draggable="true"]').forEach(card => {
      card.addEventListener('dragstart', event => {
        event.dataTransfer?.setData('text/plain', card.dataset.taskId)
      })
    })

    this.root.querySelectorAll('.js-board-column').forEach(column => {
      column.addEventListener('dragover', event => {
        event.preventDefault()
        column.classList.add('board-column--drop-target')
      })

      column.addEventListener('dragleave', () => {
        column.classList.remove('board-column--drop-target')
      })

      column.addEventListener('drop', event => {
        event.preventDefault()
        column.classList.remove('board-column--drop-target')

        if (event.target?.closest?.('.js-task-drop-zone')) {
          return
        }

        const taskId = event.dataTransfer?.getData('text/plain')
        const status = column.dataset.status

        if (!taskId || !status) {
          return
        }

        const visibleTasks = this.getTasksByStatus(status)
        const cards = [...column.querySelectorAll('.task-card')]
        let targetIndex = visibleTasks.length

        // If the user drops above the midpoint of a card, insert before it.
        // Otherwise keep scanning until we find the correct visual slot.
        for (let index = 0; index < cards.length; index += 1) {
          const card = cards[index]
          const box = card.getBoundingClientRect()
          const midpoint = box.top + box.height / 2

          if (event.clientY < midpoint) {
            targetIndex = index
            break
          }
        }

        const correctedIndex = getAdjustedTargetIndex(visibleTasks, taskId, targetIndex)

        this.bus.emit('task:move', {
          taskId,
          nextStatus: status,
          targetIndex: correctedIndex
        })
      })
    })

    this.root.querySelectorAll('.js-task-drop-zone').forEach(zone => {
      zone.addEventListener('dragover', event => {
        // Do NOT stopPropagation here: the column's dragover must also fire
        // so it can maintain its drop-target visual state consistently.
        event.preventDefault()
        zone.classList.add('task-drop-zone--active')
      })

      zone.addEventListener('dragleave', () => {
        zone.classList.remove('task-drop-zone--active')
      })

      zone.addEventListener('drop', event => {
        // Do NOT stopPropagation here: the column's drop handler will run next
        // but will exit early via the closest('.js-task-drop-zone') guard,
        // making that guard the single authoritative gatekeeper.
        event.preventDefault()
        zone.classList.remove('task-drop-zone--active')

        const taskId = event.dataTransfer?.getData('text/plain')
        const status = zone.dataset.status
        const targetIndex = Number(zone.dataset.targetIndex)

        if (!taskId || !status || Number.isNaN(targetIndex)) {
          return
        }

        // Drop zones are explicit insertion points rendered by TaskList,
        // so here we can move directly to the exact target index.
        const visibleTasks = this.getTasksByStatus(status)
        const correctedIndex = getAdjustedTargetIndex(visibleTasks, taskId, targetIndex)

        this.bus.emit('task:move', {
          taskId,
          nextStatus: status,
          targetIndex: correctedIndex
        })
      })
    })
  }

  render() {
    const { tasks, filters } = this.store.getState()
    const hasAnyTasks = tasks.length > 0
    const hasVisibleTasks = STATUSES.some(status => this.getTasksByStatus(status).length > 0)

    // This special empty state avoids a confusing board where every column
    // looks empty even though tasks do exist but are hidden by filters.
    if (hasAnyTasks && !hasVisibleTasks && (filters.query || filters.status)) {
      this.root.innerHTML = `
        <div class="board-empty-filter">
          <p class="board-empty-filter__title">No hay resultados para los filtros actuales</p>
          <p class="board-empty-filter__text">Prueba a limpiar la busqueda o cambiar el estado seleccionado.</p>
        </div>
      `
      return
    }

    this.root.innerHTML = `
      <div class="board-grid">
        ${STATUSES.map(status => this.renderColumn(status)).join('')}
      </div>
    `

    this.bindEvents()
  }
}
