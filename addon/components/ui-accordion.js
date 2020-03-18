/* eslint-disable no-unused-vars */
/* eslint-disable ember/no-jquery */
/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/no-attrs-in-components */
/* eslint-disable no-console */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import { action } from "@ember/object";
import { getOwner } from "@ember/application";
import { isHTMLSafe } from "@ember/template";
import { bind } from "@ember/runloop";
import { camelize } from "@ember/string";
import { get } from "@ember/object";
import { A } from "@ember/array";
import { isBlank, isPresent, isEqual } from "@ember/utils";
import $ from "jquery";
import Semantic from "../semantic";

export default class UIAccordionComponent extends Component {
  module = "accordion";
  classNames = ["ui", "accordion"];

  EMBER_ATTRS = ["class", "classNameBindings", "classNames", "tagName"];
  HTML_ATTRS = ["id", "name", "readonly", "autofocus", "tabindex", "title"];
  CUSTOM_ATTRS = ["onElement"];

  /// Internal Variables
  _initialized = false;
  _bindableAttrs = null;
  _settableAttrs = null;
  _ignorableAttrs = null;

  attributeBindings = ["autofocus", "tabindex", "title"];

  /// EMBER HOOKS
  constructor() {
    super(...arguments);

    if (isBlank(this.getSemanticModuleName())) {
      return console.log("A module was not declared on semantic extended type");
    }
    this._initialized = false;
    this._bindableAttrs = A();
    this._settableAttrs = A();
    this._ignorableAttrs = this.getSemanticIgnorableAttrs();
  }

  didInsertElement() {
    super.didInsertElement(...arguments);
    this.initSemanticModule();

    // Get the modules settable and gettable properties.
    let settableProperties = A(Object.keys(this.execute("internal", "set")));
    let gettableProperties = A(Object.keys(this.execute("internal", "get")));

    for (let key in this.attrs) {
      // If it has a settable and gettable attribute, then its bindable
      if (
        settableProperties.includes(key) &&
        gettableProperties.includes(key)
      ) {
        this._bindableAttrs.addObject(key);
      } else if (settableProperties.includes(key)) {
        // otherwise, its settable only
        this._settableAttrs.addObject(key);
      }
    }
    this.didInitSemantic();
    this._initialized = true;
  }

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.execute("destroy");
  }

  didUpdateAttrs() {
    super.didUpdateAttrs(...arguments);
    for (let i = 0; i < this._bindableAttrs.length; i++) {
      let bindableAttr = this._bindableAttrs[i];
      let attrValue = this._getAttrValue(bindableAttr);
      let moduleValue = this.getSemanticAttr(bindableAttr);
      if (!this.areAttrValuesEqual(bindableAttr, attrValue, moduleValue)) {
        this.setSemanticAttr(bindableAttr, attrValue);
      }
    }
    for (let i = 0; i < this._settableAttrs.length; i++) {
      let settableAttr = this._settableAttrs[i];
      let attrValue = this._getAttrValue(settableAttr);
      this.setSemanticAttr(settableAttr, attrValue);
    }
  }

  /// Semantic Hooks
  getSemanticIgnorableAttrs() {
    let ignorableAttrs = [];
    if (isPresent(this.ignorableAttrs)) {
      ignorableAttrs = ignorableAttrs.concat(this.ignorableAttrs);
    }
    ignorableAttrs = ignorableAttrs.concat(this.EMBER_ATTRS);
    ignorableAttrs = ignorableAttrs.concat(this.HTML_ATTRS);
    ignorableAttrs = ignorableAttrs.concat(this.CUSTOM_ATTRS);
    return A(ignorableAttrs);
  }

  getSemanticScope() {
    if (isPresent(this.onElement)) {
      return this.$(this.onElement);
    }
    return this.$();
  }

  getSemanticModuleName() {
    return this.module;
  }

  getSemanticModule() {
    if (this._isFastBoot()) {
      return;
    }
    let selector = this.getSemanticScope();
    if (selector != null) {
      let module = selector[this.getSemanticModuleName()];
      if (typeof module === "function") {
        return module;
      }
    }
    return null;
  }

  getSemanticModuleGlobal() {
    if (this._isFastBoot()) {
      return;
    }
    let moduleName = this.getSemanticModuleName();
    return $.fn[moduleName];
  }

  willInitSemantic(settings) {
    // eslint-disable-line no-unused-vars
    // Use this method to modify the settings object on inherited components, before module initialization
  }

  initSemanticModule() {
    if (this._isFastBoot()) {
      return;
    }
    let module = this.getSemanticModule();
    if (module) {
      module.call(this.getSemanticScope(), this._settings());
    } else {
      console.log(
        `The Semantic UI module ${this.getSemanticModuleName()} was not found and did not initialize`
      );
    }
  }

  didInitSemantic() {
    // Use this method after the module is initialized to do post initialized changes
  }

  getSemanticAttr(attrName) {
    return this.execute(`get ${attrName}`);
  }

  setSemanticAttr(attrName, attrValue) {
    return this.execute(`set ${attrName}`, this._unwrapHTMLSafe(attrValue));
  }

  areAttrValuesEqual(attrName, attrValue, moduleValue) {
    return (
      attrValue === moduleValue ||
      this._stringCompareIfPossible(attrValue) ===
        this._stringCompareIfPossible(moduleValue) ||
      isEqual(attrValue, moduleValue)
    );
  }

  // Semantic Helper Methods
  @action
  execute() {
    if (this._isFastBoot()) {
      return;
    }
    let module = this.getSemanticModule();
    if (module) {
      return module.apply(this.getSemanticScope(), arguments);
    }
    console.log(
      "The execute method was called, but the Semantic-UI module didn't exist."
    );
  }

  // @action
  // execute() {
  //   return this.execute(...arguments);
  // }

  // Private Methods
  _getAttrValue(name) {
    let value = this.attrs[name];

    if (isBlank(value)) {
      return value;
    }

    // if its a mutable object, get the actual value
    if (typeof value === "object") {
      let objectKeys = A(Object.keys(value));
      if (objectKeys.any(objectkey => objectkey.indexOf("MUTABLE_CELL") >= 0)) {
        value = get(value, "value");
      }
    }

    return value;
  }

  _settings() {
    let moduleName = this.getSemanticModuleName();

    let moduleGlobal = this.getSemanticModuleGlobal();
    if (!moduleGlobal) {
      console.log(`Unable to find jQuery Semantic UI module: ${moduleName}`);
      return;
    }

    let custom = {
      debug: Semantic.UI_DEBUG,
      performance: Semantic.UI_PERFORMANCE,
      verbose: Semantic.UI_VERBOSE
    };

    for (let key in this.attrs) {
      let value = this._getAttrValue(key);

      if (!this._hasOwnProperty(moduleGlobal.settings, key)) {
        if (
          !this._ignorableAttrs.includes(key) &&
          !this._ignorableAttrs.includes(camelize(key))
        ) {
          // TODO: Add better ember keys here
          // Ember.Logger.debug(`You passed in the property '${key}', but a setting doesn't exist on the Semantic UI module: ${moduleName}`);
        }
        continue;
      }

      if (value != null) {
        custom[key] = value;
      }
    }

    // Init, and allow any overrides
    this.willInitSemantic(custom);

    // Late bind any functions over to use the right scope
    for (let key in custom) {
      let value = custom[key];
      if (typeof value === "function") {
        custom[key] = bind(
          this,
          this._updateFunctionWithParameters(key, value)
        );
      }
      if (typeof value === "object") {
        if (isHTMLSafe(value)) {
          custom[key] = this._unwrapHTMLSafe(value);
        }
      }
    }

    return custom;
  }

  _updateFunctionWithParameters(key, fn) {
    return function() {
      var args = [].splice.call(arguments, 0);
      // always add component instance as the last parameter incase they need access to it
      args.push(this);

      if (this._initialized) {
        return fn.apply(this, args);
      }
    };
  }

  _stringCompareIfPossible(value) {
    // If its undefined or null, compare on null
    if (value == null) {
      return null;
    }
    // We should only compare string values on primitive types
    switch (typeof value) {
      case "string":
        return value;
      case "boolean":
      case "number":
        return value.toString();
      case "object":
        return this._unwrapHTMLSafe(value);
      default:
        // Don't convert to string, otherwise it would be "[Object]"
        return value;
    }
  }

  _setAttrBindable(attrName) {
    if (this._settableAttrs.includes(attrName)) {
      this._settableAttrs.removeObject(attrName);
      this._bindableAttrs.addObject(attrName);
    }
  }

  _unwrapHTMLSafe(value) {
    if (isHTMLSafe(value)) {
      return value.toString();
    }
    return value;
  }

  _hasOwnProperty(object, property) {
    if (object) {
      if (
        object.hasOwnProperty &&
        typeof object.hasOwnProperty === "function"
      ) {
        return object.hasOwnProperty(property);
      }
      // Ember 2.9 returns an EmptyObject, which doesn't have hasOwnProperty
      return Object.prototype.hasOwnProperty.call(object, property);
    }

    return false;
  }

  _isFastBoot() {
    let owner = getOwner(this);
    let fastboot = owner.lookup("service:fastboot");
    return fastboot && fastboot.isFastBoot;
  }
}
