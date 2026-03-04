/**
 * BaseControl stores the common configuration shared by form controls.
 * Small input-like components inherit from this to avoid repeating labels,
 * placeholders, and wrapper markup.
 */
export class BaseControl {
  constructor(config = {}) {
    this.label = config.label ?? ''
    this.name = config.name ?? ''
    this.placeholder = config.placeholder ?? ''
    this.inputType = config.inputType ?? 'text'
    this.value = config.value ?? ''
    this.describedBy = config.describedBy ?? ''
  }

  renderWrapper(content) {
    return `
      <label class="form-field">
        <span class="form-field__label">${this.label}</span>
        ${content}
      </label>
    `
  }
}
