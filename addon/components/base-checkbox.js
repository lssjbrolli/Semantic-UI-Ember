/* eslint-disable ember/no-jquery */
import BaseComponent from "./base";
import $ from "jquery";

export default class BaseCheckboxComponent extends BaseComponent {
  module = "checkbox";

  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.onChange) {
      // Checkbox and radio both have an implementation for this
      settings.onChange = this._onChange;
    }
    if (this.args.readonly != null) {
      $(this.component).toggleClass("read-only", this.args.readonly);
    }
  }

  didInitSemantic() {
    super.didInitSemantic(...arguments);
    // We need to fake that its bindable for checked and disabled
    this._setAttrBindable("checked");
    this._setAttrBindable("disabled");
    this._setAttrBindable("enabled");
    if (this.args.readonly != null) {
      this.settableAttrs.push("readonly");
    }
    // Init initial value set properties correctly
    if (this.args.checked != null) {
      this.setSemanticAttr("checked", this.args.checked);
    }
    if (this.args.disabled != null) {
      this.setSemanticAttr("disabled", this.args.disabled);
    }
    if (this.args.enabled != null) {
      this.setSemanticAttr("enabled", this.args.enabled);
    }
  }

  getSemanticAttr(attrName) {
    if (attrName === "checked") {
      return this.execute("is checked");
    }
    if (attrName === "disabled") {
      return this.execute("is disabled");
    }
    if (attrName === "enabled") {
      return this.execute("is enabled");
    }
    return super.getSemanticAttr(...arguments);
  }

  setSemanticAttr(attrName, attrValue) {
    // Handle checked
    if (attrName === "checked") {
      if (attrValue) {
        return this.execute("set checked");
      }
      return this.execute("set unchecked");
    }
    // Handle disabled
    if (attrName === "disabled") {
      if (attrValue) {
        return this.execute("set disabled");
      }
      return this.execute("set enabled");
    }
    // Handle enabled
    if (attrName === "enabled") {
      if (attrValue) {
        return this.execute("set enabled");
      }
      return this.execute("set disabled");
    }
    // Handle readonly
    if (attrName === "readonly") {
      // We need to add a class verses updating the property, since semantic is caching the value internall
      return $(this.component).toggleClass("read-only", attrValue);
    }
    // Default
    return super.setSemanticAttr(...arguments);
  }

  _setAttrBindable(attrName) {
    if (this.settableAttrs.includes(attrName)) {
      let arr = this.settableAttrs;
      arr.splice(arr.indexOf(attrName), 1);
      this.bindableAttrs.push(attrName);
    }
  }
}
