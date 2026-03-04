import { BoardSummary } from '../../../src/components/feedback/board-summary.js'

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

test('renders global board metrics from the store state', () => {
  const root = { innerHTML: '' }
  const listeners = new Set()
  const store = {
    getState() {
      return {
        tasks: [
          { status: 'planificada' },
          { status: 'en desarrollo' },
          { status: 'completada' }
        ]
      }
    },
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    }
  }

  const summary = new BoardSummary({ root, store })
  summary.mount()

  assert(root.innerHTML.includes('Total'), 'Expected the summary to render the total label')
  assert(root.innerHTML.includes('>3<'), 'Expected the summary to render the total count')
  assert(root.innerHTML.includes('En desarrollo'), 'Expected the summary to render the active label')
})
