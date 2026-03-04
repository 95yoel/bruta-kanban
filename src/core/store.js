/**
 * Minimal reactive store.
 * It keeps state in one place and lets UI parts subscribe to changes.
 */
export const createStore = initialState => {
  let state = initialState
  const listeners = new Set()

  return {
    getState() {
      return state
    },
    setState(partialState) {
      state = { ...state, ...partialState }
      listeners.forEach(listener => listener(state))
    },
    subscribe(listener) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    }
  }
}
