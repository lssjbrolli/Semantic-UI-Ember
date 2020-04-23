import BaseCheckboxComponent from "./base-checkbox";

export default class UiCheckboxComponent extends BaseCheckboxComponent {
  ignorableAttrs = ["checked", "label", "disabled", "readonly"];

  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.onChange) {
      settings.onChange = this._onChange;
    }
  }

  // Internal wrapper for onchange, to pass through checked
  _onChange() {
    let checked = this.execute("is checked");
    return this.args.onChange(checked, this);
  }
}
