/**
 * Clean imported raw JSON items and turn them into safe task objects.
 * This prevents broken or incomplete files from crashing the app.
 */
import { createId } from './id.js'

export const sanitizeImportedTasks = importedTasks => importedTasks
  .filter(task => task && typeof task === 'object')
  // Every imported item is normalized into the shape the app expects.
  // This means the rest of the UI can assume a predictable task schema.
  .map((task, index) => ({
    id: typeof task.id === 'string' && task.id.trim() ? task.id : createId(),
    title: typeof task.title === 'string' && task.title.trim() ? task.title.trim() : `Tarea importada ${index + 1}`,
    description: typeof task.description === 'string' ? task.description.trim() : '',
    status: typeof task.status === 'string' ? task.status : 'planificada',
    createdAt: typeof task.createdAt === 'string' ? task.createdAt : new Date().toISOString(),
    startedAt: typeof task.startedAt === 'string' ? task.startedAt : '',
    completedAt: typeof task.completedAt === 'string' ? task.completedAt : '',
    elapsedSeconds: Number.isFinite(task.elapsedSeconds) ? task.elapsedSeconds : 0,
    order: Number.isFinite(task.order) ? task.order : index
  }))
