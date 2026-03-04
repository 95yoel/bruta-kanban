const DATABASE_NAME = 'native-kanban-db'
const STORE_NAME = 'tasks'
const DATABASE_VERSION = 1

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

      request.onsuccess = () => resolve(request.result)
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
          store.put(task)
        })
      }

      transaction.oncomplete = () => resolve(tasks)
      transaction.onerror = () => reject(transaction.error)
    })
  }
}
