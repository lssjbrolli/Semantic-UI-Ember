/* eslint-disable ember/no-jquery */
/* eslint-disable ember/no-attrs-in-components */
/* eslint-disable ember/no-new-mixins */
import { getOwner } from "@ember/application";
import Mixin from "@ember/object/mixin";
import $ from "jquery";
import Base from "./base";

/*
 * Checkbox Component Mixin
 */
var CheckboxMixin = Mixin.create(Base, {
  module: "checkbox",
  classNames: ["ui", "checkbox"],

  willInitSemantic(settings) {
    let owner = getOwner(this);
    let fastboot = owner.lookup("service:fastboot");
    if (fastboot && fastboot.get("isFastBoot")) {
      return;
    }
    this._super(...arguments);
    if (settings.onChange) {
      // Checkbox and radio both have an implementation for this
      settings.onChange = this._onChange;
    }
    if (this._hasOwnProperty(this.attrs, "readonly") || this.readonly != null) {
      $(this.element).toggleClass("read-only", this.readonly);
    }
  },

  didInitSemantic() {
    this._super(...arguments);
    // We need to fake that its bindable for checked and disabled
    this._setAttrBindable("checked");
    this._setAttrBindable("disabled");
    this._setAttrBindable("enabled");
    if (this.readonly != null) {
      this._settableAttrs.addObject("readonly");
    }
    // Init initial value set properties correctly
    if (this.checked != null) {
      this.setSemanticAttr("checked", this.checked);
    }
    if (this.disabled != null) {
      this.setSemanticAttr("disabled", this.disabled);
    }
    if (this.enabled != null) {
      this.setSemanticAttr("enabled", this.enabled);
    }
  },

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
    return this._super(...arguments);
  },

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
      return $(this.element).toggleClass("read-only", attrValue);
    }
    // Default
    return this._super(...arguments);
  }
});

export default CheckboxMixin;
