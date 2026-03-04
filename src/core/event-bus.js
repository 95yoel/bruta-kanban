/**
 * Small event hub built on top of the browser EventTarget API.
 * Components use this instead of calling each other directly.
 */
export class EventBus {
  constructor() {
    this.target = new EventTarget()
  }

  on(eventName, handler) {
    const wrappedHandler = event => handler(event.detail)
    this.target.addEventListener(eventName, wrappedHandler)

    return () => {
      this.target.removeEventListener(eventName, wrappedHandler)
    }
  }

  emit(eventName, detail = {}) {
    this.target.dispatchEvent(new CustomEvent(eventName, { detail }))
  }
}
