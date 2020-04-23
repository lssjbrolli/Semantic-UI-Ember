import BaseCheckboxComponent from "./base-checkbox";
import { action } from "@ember/object";
import { hash } from "rsvp";

export default class UiRadioComponent extends BaseCheckboxComponent {
  ignorableAttrs = ["current", "disabled", "label", "readonly", "value"];

  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.onChange) {
      settings.onChange = this._onChange;
    }
  }

  // Internal wrapper for onchange, to pass through checked
  _onChange() {
    let value = this.args.value;
    return this.args.onChange(value, this);
  }

  @action
  initModule() {
    super.initModule(...arguments);
    this._inspectValueAndCurrent();
  }

  @action
  updateModule() {
    super.updateModule(...arguments);
    this._inspectValueAndCurrent();
  }

  _inspectValueAndCurrent() {
    let value = this.args.value;
    let current = this.args.current;

    return hash({ value, current }).then((hash) =>
      this._checkValueAndCurrent(hash)
    );
  }

  _checkValueAndCurrent(hash) {
    let isChecked = this.execute("is checked");
    if (this.areAttrValuesEqual("checked", hash.value, hash.current)) {
      // Value and current match, but radio isn't checked, return false
      if (!isChecked) {
        return this.execute("set checked");
      }
    } else {
      // Value and current don't match and radio is checked, return false
      if (isChecked) {
        return this.execute("set unchecked");
      }
    }
  }
}
