import { EventBus } from './core/event-bus.js'
import { createStore } from './core/store.js'
import { canTransitionTask } from './core/task-rules.js'
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
  filters: {
    query: '',
    status: ''
  }
})

const boardRoot = document.querySelector('.js-board-section')
const createDialogRoot = document.querySelector('.js-task-dialog')
const detailDialogRoot = document.querySelector('.js-task-detail-dialog')
const filterQueryInput = document.querySelector('.js-filter-query')
const filterStatusInput = document.querySelector('.js-filter-status')

const board = new TaskBoard({
  root: boardRoot,
  bus,
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
        id: crypto.randomUUID(),
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
  toast.show('Tarea eliminada')
})

bus.on('filter:update', filters => {
  store.setState({
    filters: {
      ...store.getState().filters,
      ...filters
    }
  })
})

bus.on('task:select', taskId => {
  store.setState({ selectedTaskId: taskId })
  detailDialog.open()
})

const bootstrap = async () => {
  await loadTasks()
  toast.mount()
  board.mount()
  createDialog.mount()
  detailDialog.mount()
  filterQueryInput.addEventListener('input', event => {
    bus.emit('filter:update', { query: event.target.value })
  })
  filterStatusInput.addEventListener('change', event => {
    bus.emit('filter:update', { status: event.target.value })
  })
  syncTimer()
}

bootstrap()
