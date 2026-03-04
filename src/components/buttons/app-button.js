export class AppButton {
  constructor(config = {}) {
    this.label = config.label ?? ''
    this.type = config.type ?? 'button'
    this.variant = config.variant ?? 'primary'
    this.className = config.className ?? ''
    this.attributes = config.attributes ?? {}
  }

  renderAttributes() {
    return Object.entries(this.attributes)
      .map(([key, value]) => `${key}="${String(value)}"`)
      .join(' ')
  }

  render() {
    const variantClass = this.variant === 'ghost' ? 'button-ghost' : 'button-primary'
    const classNames = ['button', variantClass, this.className].filter(Boolean).join(' ')
    const extraAttributes = this.renderAttributes()

    return `
      <button class="${classNames}" type="${this.type}" ${extraAttributes}>
        ${this.label}
      </button>
    `
  }
}
