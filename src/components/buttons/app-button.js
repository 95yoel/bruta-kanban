/**
 * AppButton is a tiny reusable button renderer.
 * It keeps button markup consistent across the whole interface.
 */
export class AppButton {
  constructor(config = {}) {
    this.label = config.label ?? ''
    this.type = config.type ?? 'button'
    this.variant = config.variant ?? 'primary'
    this.className = config.className ?? ''
    this.attributes = config.attributes ?? {}
    this.iconSrc = config.iconSrc ?? ''
    this.iconAlt = config.iconAlt ?? ''
    this.compact = config.compact ?? false
  }

  renderAttributes() {
    return Object.entries(this.attributes)
      .map(([key, value]) => `${key}="${String(value)}"`)
      .join(' ')
  }

  render() {
    const variantClass = this.variant === 'ghost' ? 'button-ghost' : 'button-primary'
    const classNames = [
      'button',
      variantClass,
      this.compact ? 'button-compact' : '',
      this.className
    ].filter(Boolean).join(' ')
    const extraAttributes = this.renderAttributes()
    const content = this.iconSrc
      ? `
        <span class="button__content">
          <img class="button__icon" src="${this.iconSrc}" alt="${this.iconAlt}">
          <span class="button__label">${this.label}</span>
        </span>
      `
      : this.label

    return `
      <button class="${classNames}" type="${this.type}" ${extraAttributes}>
        ${content}
      </button>
    `
  }
}
