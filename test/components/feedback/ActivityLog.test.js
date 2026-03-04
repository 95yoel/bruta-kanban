import { ActivityLog } from '../../../src/components/feedback/activity-log.js'

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message)
  }
}

const test = (name, callback) => {
  try {
    callback()
    console.log(`PASS: ${name}`)
  } catch (error) {
    console.error(`FAIL: ${name}`)
    console.error(error.message)
  }
}

test('renders recent history entries', () => {
  const root = { innerHTML: '' }
  const listeners = new Set()
  const store = {
    getState() {
      return {
        history: ['Tarea creada: Demo', 'Tarea eliminada']
      }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }

  const log = new ActivityLog({ root, store })
  log.mount()

  assert(root.innerHTML.includes('Actividad reciente'), 'Expected the activity title to be rendered')
  assert(root.innerHTML.includes('Tarea creada: Demo'), 'Expected the first history item to be rendered')
})
