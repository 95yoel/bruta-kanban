import { createId } from './id.js'
import { matchesTaskFilters } from './task-filters.js'
import { canTransitionTask } from './task-rules.js'

/**
 * Ensure every task has a stable numeric order so board columns can be sorted.
 */
export const normalizeOrdering = tasks => tasks.map((task, index) => ({
  ...task,
  order: Number.isFinite(task.order) ? task.order : index
}))

/**
 * Create the first demo task used when the database is empty.
 */
export const createInitialTasks = () => normalizeOrdering([
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

/**
 * Get the next order number for a newly created task.
 */
export const getNextOrder = tasks => {
  if (tasks.length === 0) {
    return 0
  }

  return Math.max(...tasks.map(task => task.order ?? 0)) + 1
}

/**
 * Return only the tasks visible for the current filter state.
 */
export const getVisibleTasks = (tasks, filters) => tasks.filter(task => matchesTaskFilters(task, filters))

/**
 * Move one task to a new status and insert it at the desired position.
 * This powers both button-based moves and drag-and-drop reorder.
 */
export const applyTaskMove = (tasks, taskId, nextStatus, targetIndex = null) => {
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

  return {
    tasks: normalizeOrdering([...beforeTarget, ...targetStatusTasks, ...afterTarget]),
    moved: true
  }
}
