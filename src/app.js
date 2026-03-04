import { EventBus } from './core/event-bus.js'
import { createStore } from './core/store.js'
import { IndexedDbTaskService } from './services/indexeddb-service.js'
import { TaskBoard } from './components/board/task-board.js'
import { TaskDialog } from './components/dialogs/task-dialog.js'
import { TaskDetailDialog } from './components/dialogs/task-detail-dialog.js'

const bus = new EventBus()
const taskService = new IndexedDbTaskService()

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
}

bus.on('task:create', task => {
  const currentState = store.getState()
  const nextTasks = [task, ...currentState.tasks]
  store.setState({ tasks: nextTasks })
  persistTasks(nextTasks)
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

  store.setState({ tasks: nextTasks })
  persistTasks(nextTasks)
})

bus.on('task:select', taskId => {
  store.setState({ selectedTaskId: taskId })
  detailDialog.open()
})

const tickActiveTasks = () => {
  const currentState = store.getState()
  const nextTasks = currentState.tasks.map(task => (
    task.status === 'en desarrollo'
      ? { ...task, elapsedSeconds: task.elapsedSeconds + 1 }
      : task
  ))

  store.setState({ tasks: nextTasks })
  persistTasks(nextTasks)
}

setInterval(tickActiveTasks, 1000)

const bootstrap = async () => {
  await loadTasks()
  board.mount()
  createDialog.mount()
  detailDialog.mount()
}

bootstrap()
