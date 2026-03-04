import { BaseControl } from '../base/base-control.js'

export class TextArea extends BaseControl {
  constructor(config = {}) {
    super(config)
    this.rows = config.rows ?? 4
  }

  render() {
    return this.renderWrapper(`
      <textarea
        class="form-field__input form-field__textarea"
        name="${this.name}"
        placeholder="${this.placeholder}"
        rows="${this.rows}"
        ${this.describedBy ? `aria-describedby="${this.describedBy}"` : ''}
      >${this.value}</textarea>
    `)
  }
}
