/**
 * ToastNotice shows short-lived feedback messages in the corner of the screen.
 * It is intentionally simple: one visible message at a time.
 */
export class ToastNotice {
  constructor() {
    this.root = null
    this.timeoutId = null
  }

  mount() {
    this.root = document.createElement('div')
    this.root.className = 'toast-stack'
    document.body.appendChild(this.root)
  }

  show(message) {
    if (!this.root) {
      return
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.root.innerHTML = `<p class="toast-notice">${message}</p>`

    this.timeoutId = setTimeout(() => {
      this.root.innerHTML = ''
      this.timeoutId = null
    }, 2200)
  }
}
