/**
 * TextInput renders a standard one-line input field using BaseControl data.
 */
import { BaseControl } from '../base/base-control.js'

export class TextInput extends BaseControl {
  render() {
    return this.renderWrapper(`
      <input
        class="form-field__input"
        type="${this.inputType}"
        name="${this.name}"
        placeholder="${this.placeholder}"
        value="${this.value}"
        ${this.describedBy ? `aria-describedby="${this.describedBy}"` : ''}
      >
    `)
  }
}
