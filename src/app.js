import { EventBus } from './core/event-bus.js'
import { createStore } from './core/store.js'
import { IndexedDbTaskService } from './services/indexeddb-service.js'
import { TaskBoard } from './components/board/task-board.js'
import { TaskDialog } from './components/dialogs/task-dialog.js'
import { TaskDetailDialog } from './components/dialogs/task-detail-dialog.js'

const bus = new EventBus()
const taskService = new IndexedDbTaskService()
let activeTimerId = null
let persistTimeoutId = null

const store = createStore({
  tasks: [],
  selectedTaskId: null
})

const boardRoot = document.querySelector('.js-board-section')
const createDialogRoot = document.querySelector('.js-task-dialog')
const detailDialogRoot = document.querySelector('.js-task-detail-dialog')

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
    store.setState({ tasks })
    return
  }

  store.setState({
    tasks: [
      {
        id: crypto.randomUUID(),
        title: 'Definir arquitectura base',
        description: 'Crear shell inicial del proyecto y dividir responsabilidades',
        status: 'planificada',
        createdAt: new Date().toISOString(),
        startedAt: '',
        completedAt: '',
        elapsedSeconds: 0
      }
    ]
  })

  schedulePersist(store.getState().tasks)
}

bus.on('task:create', task => {
  const currentState = store.getState()
  const nextTasks = [task, ...currentState.tasks]
  updateTasks(nextTasks)
})

bus.on('task:move', ({ taskId, nextStatus }) => {
  const currentState = store.getState()
  const nextTasks = currentState.tasks.map(task => {
    if (task.id !== taskId) {
      return task
    }

    const nextTask = { ...task, status: nextStatus }

    if (nextStatus === 'en desarrollo' && !nextTask.startedAt) {
      nextTask.startedAt = new Date().toISOString()
    }

    if (nextStatus === 'completada' && !nextTask.completedAt) {
      nextTask.completedAt = new Date().toISOString()
    }

    return nextTask
  })

  updateTasks(nextTasks)
})

bus.on('task:update', ({ taskId, title, description }) => {
  const currentState = store.getState()
  const nextTasks = currentState.tasks.map(task => (
    task.id === taskId
      ? { ...task, title, description }
      : task
  ))

  updateTasks(nextTasks)
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
})

bus.on('task:select', taskId => {
  store.setState({ selectedTaskId: taskId })
  detailDialog.open()
})

const bootstrap = async () => {
  await loadTasks()
  board.mount()
  createDialog.mount()
  detailDialog.mount()
  syncTimer()
}

bootstrap()
