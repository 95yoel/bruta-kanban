/**
 * IndexedDbTaskService is the persistence boundary of the app.
 * The UI only knows it can load and save normalized task objects here.
 */
import { createId } from '../core/id.js'

const DATABASE_NAME = 'native-kanban-db'
const STORE_NAME = 'tasks'
const DATABASE_VERSION = 1

const normalizeTask = task => ({
  id: task?.id ?? createId(),
  title: typeof task?.title === 'string' ? task.title : 'Tarea sin titulo',
  description: typeof task?.description === 'string' ? task.description : '',
  status: typeof task?.status === 'string' ? task.status : 'planificada',
  createdAt: typeof task?.createdAt === 'string' ? task.createdAt : new Date().toISOString(),
  startedAt: typeof task?.startedAt === 'string' ? task.startedAt : '',
  completedAt: typeof task?.completedAt === 'string' ? task.completedAt : '',
  elapsedSeconds: Number.isFinite(task?.elapsedSeconds) ? task.elapsedSeconds : 0,
  order: Number.isFinite(task?.order) ? task.order : 0
})

export class IndexedDbTaskService {
  async open() {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

      request.onupgradeneeded = () => {
        const database = request.result

        if (!database.objectStoreNames.contains(STORE_NAME)) {
          database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getAll() {
    const database = await this.open()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result.map(normalizeTask))
      request.onerror = () => reject(request.error)
    })
  }

  async saveAll(tasks) {
    const database = await this.open()

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const clearRequest = store.clear()

      clearRequest.onerror = () => reject(clearRequest.error)

      clearRequest.onsuccess = () => {
        tasks.forEach(task => {
          store.put(normalizeTask(task))
        })
      }

      transaction.oncomplete = () => resolve(tasks)
      transaction.onerror = () => reject(transaction.error)
    })
  }
}

export { normalizeTask }
