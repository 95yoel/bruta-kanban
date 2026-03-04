/**
 * app.js is now the thin composition root of the application.
 * Its job is to wire modules together, subscribe to events, and start the UI.
 * Heavy logic is pushed into core helpers so the entry point stays readable.
 */
import { EventBus } from './core/event-bus.js'
import { loadStoredFilters, saveStoredFilters } from './core/browser-storage.js'
import { createStore } from './core/store.js'
import { sanitizeImportedTasks } from './core/task-import.js'
import { applyTaskMove, createInitialTasks, getNextOrder, getVisibleTasks, normalizeOrdering } from './core/task-state.js'
import { BoardSummary } from './components/feedback/board-summary.js'
import { ActivityLog } from './components/feedback/activity-log.js'
import { ToastNotice } from './components/feedback/toast-notice.js'
import { IndexedDbTaskService } from './services/indexeddb-service.js'
import { TaskBoard } from './components/board/task-board.js'
import { TaskDialog } from './components/dialogs/task-dialog.js'
import { TaskDetailDialog } from './components/dialogs/task-detail-dialog.js'

const bus = new EventBus()
const taskService = new IndexedDbTaskService()
const toast = new ToastNotice()
let activeTimerId = null
let persistTimeoutId = null

const store = createStore({
  tasks: [],
  selectedTaskId: null,
  history: [],
  filters: {
    query: '',
    status: ''
  }
})

const FILTER_STORAGE_KEY = 'native-kanban-filters'
const boardRoot = document.querySelector('.js-board-section')
const summaryRoot = document.querySelector('.js-board-summary')
const activityLogRoot = document.querySelector('.js-activity-log')
const createDialogRoot = document.querySelector('.js-task-dialog')
const detailDialogRoot = document.querySelector('.js-task-detail-dialog')
const filterQueryInput = document.querySelector('.js-filter-query')
const filterStatusInput = document.querySelector('.js-filter-status')
const exportTasksButton = document.querySelector('.js-export-tasks')
const importTasksInput = document.querySelector('.js-import-tasks')

const board = new TaskBoard({
  root: boardRoot,
  bus,
  store
})

const summary = new BoardSummary({
  root: summaryRoot,
  store
})

const activityLog = new ActivityLog({
  root: activityLogRoot,
  store
})

const createDialog = new TaskDialog({
  root: createDialogRoot,
  bus
})

const detailDialog = new TaskDetailDialog({
  root: detailDialogRoot,
  bus,
  store
})

const exportTasksAsJson = tasks => {
  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = 'native-kanban-tasks.json'
  anchor.click()
  window.URL.revokeObjectURL(url)
}

const addHistoryEntry = entry => {
  const history = [entry, ...(store.getState().history || [])].slice(0, 5)
  store.setState({ history })
}

const persistTasks = async tasks => {
  await taskService.saveAll(tasks)
}

const schedulePersist = tasks => {
  if (persistTimeoutId) {
    clearTimeout(persistTimeoutId)
  }

  // We debounce writes so fast UI actions (drag, typing, quick moves)
  // do not hammer IndexedDB with a write for every tiny intermediate step.
  persistTimeoutId = setTimeout(() => {
    persistTasks(tasks)
    persistTimeoutId = null
  }, 150)
}

const updateTasks = nextTasks => {
  store.setState({ tasks: nextTasks })
  schedulePersist(nextTasks)
  syncTimer()
}

const hasActiveTasks = tasks => tasks.some(task => task.status === 'en desarrollo')

const syncTimer = () => {
  const { tasks } = store.getState()

  if (hasActiveTasks(tasks) && !activeTimerId) {
    // The timer starts only when at least one task is actively being worked on.
    // This keeps the app simple and avoids background work when nothing is running.
    activeTimerId = setInterval(() => {
      const currentState = store.getState()

      if (!hasActiveTasks(currentState.tasks)) {
        clearInterval(activeTimerId)
        activeTimerId = null
        return
      }

      const nextTasks = currentState.tasks.map(task => (
        task.status === 'en desarrollo'
          ? { ...task, elapsedSeconds: task.elapsedSeconds + 1 }
          : task
      ))

      // Timer ticks also persist, because elapsed time is user data and should
      // survive refreshes or browser restarts.
      store.setState({ tasks: nextTasks })
      schedulePersist(nextTasks)
    }, 1000)
  }

  if (!hasActiveTasks(tasks) && activeTimerId) {
    clearInterval(activeTimerId)
    activeTimerId = null
  }
}

const loadTasks = async () => {
  const tasks = await taskService.getAll()

  if (tasks.length > 0) {
    store.setState({ tasks: normalizeOrdering(tasks) })
    return
  }

  store.setState({
    tasks: createInitialTasks()
  })

  schedulePersist(store.getState().tasks)
}

bus.on('task:create', task => {
  const currentState = store.getState()

  // New tasks are inserted with the next order number so the board can keep
  // a stable explicit order instead of depending on array insertion side effects.
  const nextTasks = normalizeOrdering([
    {
      ...task,
      order: getNextOrder(currentState.tasks)
    },
    ...currentState.tasks
  ])
  updateTasks(nextTasks)
  addHistoryEntry(`Tarea creada: ${task.title}`)
  toast.show('Tarea creada')
})

bus.on('task:move', ({ taskId, nextStatus, targetIndex = null }) => {
  const currentState = store.getState()
  const moveResult = applyTaskMove(currentState.tasks, taskId, nextStatus, targetIndex)

  if (!moveResult.moved) {
    toast.show('Movimiento no permitido')
    return
  }

  updateTasks(moveResult.tasks)
  addHistoryEntry(`Tarea movida a ${nextStatus}`)
  toast.show(`Tarea movida a ${nextStatus}`)
})

bus.on('task:update', ({ taskId, title, description }) => {
  const currentState = store.getState()
  const nextTasks = currentState.tasks.map(task => (
    task.id === taskId
      ? { ...task, title, description }
      : task
  ))

  updateTasks(nextTasks)
  addHistoryEntry(`Tarea actualizada: ${title}`)
  toast.show('Tarea actualizada')
})

bus.on('task:delete', taskId => {
  const currentState = store.getState()
  const nextTasks = currentState.tasks.filter(task => task.id !== taskId)
  const nextSelectedTaskId = currentState.selectedTaskId === taskId ? null : currentState.selectedTaskId

  store.setState({
    tasks: nextTasks,
    selectedTaskId: nextSelectedTaskId
  })

  schedulePersist(nextTasks)
  syncTimer()
  addHistoryEntry('Tarea eliminada')
  toast.show('Tarea eliminada')
})

bus.on('filter:update', filters => {
  const nextFilters = {
    ...store.getState().filters,
    ...filters
  }

  store.setState({
    filters: nextFilters
  })

  saveStoredFilters(FILTER_STORAGE_KEY, nextFilters)
})

bus.on('task:import', importedTasks => {
  const nextTasks = normalizeOrdering(importedTasks)
  updateTasks(nextTasks)
  addHistoryEntry(`Importadas ${nextTasks.length} tareas`)
  toast.show('Tareas importadas')
})

bus.on('task:select', taskId => {
  store.setState({ selectedTaskId: taskId })
  detailDialog.open()
})

const bootstrap = async () => {
  const persistedFilters = loadStoredFilters(FILTER_STORAGE_KEY)

  store.setState({
    filters: persistedFilters
  })

  await loadTasks()
  toast.mount()
  summary.mount()
  activityLog.mount()
  board.mount()
  createDialog.mount()
  detailDialog.mount()
  filterQueryInput.value = persistedFilters.query
  filterStatusInput.value = persistedFilters.status
  filterQueryInput.addEventListener('input', event => {
    bus.emit('filter:update', { query: event.target.value })
  })
  filterStatusInput.addEventListener('change', event => {
    bus.emit('filter:update', { status: event.target.value })
  })
  exportTasksButton.addEventListener('click', () => {
    const { tasks, filters } = store.getState()
    const hasFilters = Boolean(filters.query || filters.status)
    const exportTasks = hasFilters ? getVisibleTasks(tasks, filters) : tasks

    exportTasksAsJson(exportTasks)
    addHistoryEntry(`Exportadas ${exportTasks.length} tareas`)
    toast.show('Exportacion completada')
  })
  importTasksInput.addEventListener('change', async event => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const rawContent = await file.text()
      const parsed = JSON.parse(rawContent)

      if (!Array.isArray(parsed)) {
        throw new Error('Formato no valido')
      }

      // Import is destructive because it replaces the current dataset.
      // Ask first when the board already contains tasks.
      if (store.getState().tasks.length > 0) {
        const confirmed = window.confirm('La importacion reemplazara las tareas actuales. Continuar?')

        if (!confirmed) {
          importTasksInput.value = ''
          return
        }
      }

      const sanitizedTasks = sanitizeImportedTasks(parsed)

      // A file can be valid JSON but still useless for the app.
      // If nothing survives sanitization, treat it as an invalid import.
      if (sanitizedTasks.length === 0) {
        throw new Error('Sin tareas validas')
      }

      bus.emit('task:import', sanitizedTasks)
    } catch {
      toast.show('No se pudo importar el archivo')
    } finally {
      importTasksInput.value = ''
    }
  })
  syncTimer()
}

bootstrap()
