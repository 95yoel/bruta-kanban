/**
 * BoardSummary shows high-level counters derived from the current store state.
 * It is a read-only dashboard for quick situational awareness.
 */
export class BoardSummary {
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
    const { tasks } = this.store.getState()
    const total = tasks.length
    const planned = tasks.filter(task => task.status === 'planificada').length
    const active = tasks.filter(task => task.status === 'en desarrollo').length
    const completed = tasks.filter(task => task.status === 'completada').length

    this.root.innerHTML = `
      <div class="summary-card">
        <span class="summary-card__label">Total</span>
        <strong class="summary-card__value">${total}</strong>
      </div>
      <div class="summary-card">
        <span class="summary-card__label">Planificadas</span>
        <strong class="summary-card__value">${planned}</strong>
      </div>
      <div class="summary-card">
        <span class="summary-card__label">En desarrollo</span>
        <strong class="summary-card__value">${active}</strong>
      </div>
      <div class="summary-card">
        <span class="summary-card__label">Completadas</span>
        <strong class="summary-card__value">${completed}</strong>
      </div>
    `
  }
}
