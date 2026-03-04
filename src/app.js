import { EventBus } from './core/event-bus.js'
import { createId } from './core/id.js'
import { createStore } from './core/store.js'
import { sanitizeImportedTasks } from './core/task-import.js'
import { matchesTaskFilters } from './core/task-filters.js'
import { canTransitionTask } from './core/task-rules.js'
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

const loadPersistedFilters = () => {
  try {
    const rawValue = window.localStorage.getItem(FILTER_STORAGE_KEY)

    if (!rawValue) {
      return { query: '', status: '' }
    }

    const parsed = JSON.parse(rawValue)
    return {
      query: typeof parsed.query === 'string' ? parsed.query : '',
      status: typeof parsed.status === 'string' ? parsed.status : ''
    }
  } catch {
    return { query: '', status: '' }
  }
}

const persistFilters = filters => {
  window.localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters))
}

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

const getNextOrder = tasks => {
  if (tasks.length === 0) {
    return 0
  }

  return Math.max(...tasks.map(task => task.order ?? 0)) + 1
}

const getVisibleTasks = (tasks, filters) => tasks.filter(task => matchesTaskFilters(task, filters))

const normalizeOrdering = tasks => tasks.map((task, index) => ({
  ...task,
  order: Number.isFinite(task.order) ? task.order : index
}))

const applyTaskMove = (tasks, taskId, nextStatus, targetIndex = null) => {
  const sourceTask = tasks.find(task => task.id === taskId)

  if (!sourceTask) {
    return { tasks, moved: false }
  }

  if (!canTransitionTask(sourceTask.status, nextStatus) && sourceTask.status !== nextStatus) {
    return { tasks, moved: false }
  }

  const remainingTasks = tasks.filter(task => task.id !== taskId)
  const updatedTask = {
    ...sourceTask,
    status: nextStatus
  }

  if (nextStatus === 'en desarrollo' && !updatedTask.startedAt) {
    updatedTask.startedAt = new Date().toISOString()
  }

  if (nextStatus === 'completada' && !updatedTask.completedAt) {
    updatedTask.completedAt = new Date().toISOString()
  }

  const beforeTarget = []
  const targetStatusTasks = []
  const afterTarget = []

  remainingTasks.forEach(task => {
    if (task.status !== nextStatus) {
      if (targetStatusTasks.length === 0) {
        beforeTarget.push(task)
      } else {
        afterTarget.push(task)
      }
      return
    }

    targetStatusTasks.push(task)
  })

  const insertionIndex = targetIndex === null
    ? targetStatusTasks.length
    : Math.max(0, Math.min(targetIndex, targetStatusTasks.length))

  targetStatusTasks.splice(insertionIndex, 0, updatedTask)

  const merged = [...beforeTarget, ...targetStatusTasks, ...afterTarget]
  return {
    tasks: normalizeOrdering(merged),
    moved: true
  }
}

const hasActiveTasks = tasks => tasks.some(task => task.status === 'en desarrollo')

const syncTimer = () => {
  const { tasks } = store.getState()

  if (hasActiveTasks(tasks) && !activeTimerId) {
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
    tasks: normalizeOrdering([
      {
        id: createId(),
        title: 'Definir arquitectura base',
        description: 'Crear shell inicial del proyecto y dividir responsabilidades',
        status: 'planificada',
        createdAt: new Date().toISOString(),
        startedAt: '',
        completedAt: '',
        elapsedSeconds: 0,
        order: 0
      }
    ])
  })

  schedulePersist(store.getState().tasks)
}

bus.on('task:create', task => {
  const currentState = store.getState()
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

  persistFilters(nextFilters)
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
  const persistedFilters = loadPersistedFilters()

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

      if (store.getState().tasks.length > 0) {
        const confirmed = window.confirm('La importacion reemplazara las tareas actuales. Continuar?')

        if (!confirmed) {
          importTasksInput.value = ''
          return
        }
      }

      const sanitizedTasks = sanitizeImportedTasks(parsed)

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
