/* eslint-disable ember/no-attrs-in-components */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import { action } from "@ember/object";
import Checkbox from "../mixins/checkbox";

export default class UiCheckboxComponent extends Component.extend(Checkbox) {
  type = "checkbox";
  ignorableAttrs = ["checked", "label", "disabled"];

  // Internal wrapper for onchange, to pass through checked
  _onChange() {
    let checked = this.execute("is checked");
    return this.attrs.onChange(checked, this);
  }
  @action
  exec() {
    return this.execute(...arguments);
  }
}
