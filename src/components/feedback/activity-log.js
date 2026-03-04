export class ActivityLog {
  constructor({ root, store }) {
    this.root = root
    this.store = store
  }

  mount() {
    this.store.subscribe(() => {
      this.render()
    })

    this.render()
  }

  render() {
    const history = this.store.getState().history || []

    if (history.length === 0) {
      this.root.innerHTML = ''
      return
    }

    this.root.innerHTML = `
      <div class="activity-log__panel">
        <h2 class="activity-log__title">Actividad reciente</h2>
        <ul class="activity-log__list">
          ${history.map(item => `<li class="activity-log__item">${item}</li>`).join('')}
        </ul>
      </div>
    `
  }
}
