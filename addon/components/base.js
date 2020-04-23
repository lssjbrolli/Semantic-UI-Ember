/* eslint-disable ember/no-jquery */
import Component from "@glimmer/component";
import { action } from "@ember/object";
import { isEqual, isPresent } from "@ember/utils";
import { camelize } from "@ember/string";
import { isHTMLSafe } from "@ember/template";
import { bind } from "@ember/runloop";
import $ from "jquery";
import Semantic from "../semantic";

export default class BaseComponent extends Component {
  component;
  ignorableAttrs = [];
  bindableAttrs = [];
  settableAttrs = [];
  initialized = false;

  @action
  initModule(e) {
    this.component = e;
    this.initSemanticModule();

    // Get the modules settable and gettable properties.
    let settableProperties = Object.keys(this.execute("internal", "set"));
    let gettableProperties = Object.keys(this.execute("internal", "get"));

    // get all bindable args
    // console.log(
    //   settableProperties.filter((value) => gettableProperties.includes(value))
    // );

    for (let key in this.args) {
      // If it has a settable and gettable attribute, then its bindable
      if (
        settableProperties.includes(key) &&
        gettableProperties.includes(key)
      ) {
        this.bindableAttrs.push(key);
      } else if (settableProperties.includes(key)) {
        // otherwise, its settable only
        this.settableAttrs.push(key);
      }
    }

    this.didInitSemantic();
    this.initialized = true;
  }

  @action
  updateModule() {
    for (let i = 0; i < this.bindableAttrs.length; i++) {
      let bindableAttr = this.bindableAttrs[i];
      let attrValue = this.args[bindableAttr];
      let moduleValue = this.getSemanticAttr(bindableAttr);
      if (!this.areAttrValuesEqual(bindableAttr, attrValue, moduleValue)) {
        this.setSemanticAttr(bindableAttr, attrValue);
      }
    }
    for (let i = 0; i < this.settableAttrs.length; i++) {
      let settableAttr = this.settableAttrs[i];
      let attrValue = this.args[settableAttr];
      this.setSemanticAttr(settableAttr, attrValue);
    }
  }

  @action
  execute() {
    let module = this.getSemanticModule();
    if (module) {
      return module.apply(this.getSemanticScope(), arguments);
    }
    // eslint-disable-next-line no-console
    console.log(
      "The execute method was called, but the Semantic-UI module didn't exist."
    );
  }

  initSemanticModule() {
    let module = this.getSemanticModule();
    if (module) {
      module.call(this.getSemanticScope(), this.settings());
    } else {
      // eslint-disable-next-line no-console
      console.log(
        `The Semantic UI module ${this.module} was not found and did not initialize`
      );
    }
  }

  // eslint-disable-next-line no-unused-vars
  willInitSemantic(settings) {
    // Use this method to modify the settings object on inherited components, before module initialization
  }

  didInitSemantic() {
    // Use this method after the module is initialized to do post initialized changes
  }

  getSemanticModule() {
    let selector = this.getSemanticScope();
    if (selector != null) {
      let module = selector[this.module];
      if (typeof module === "function") {
        return module;
      }
    }
    return null;
  }

  getSemanticScope() {
    if (isPresent(this.args.onElement)) {
      return $(this.args.onElement);
    }

    return $(this.component);
  }

  getSemanticModuleGlobal() {
    return $.fn[this.module];
  }

  settings() {
    let moduleGlobal = this.getSemanticModuleGlobal();

    if (!moduleGlobal) {
      // eslint-disable-next-line no-console
      console.log(`Unable to find jQuery Semantic UI module: ${this.module}`);
      return;
    }

    let custom = {
      debug: Semantic.UI_DEBUG,
      performance: Semantic.UI_PERFORMANCE,
      verbose: Semantic.UI_VERBOSE,
    };

    for (let key in this.args) {
      let value = this.args[key];

      if (!this._hasOwnProperty(moduleGlobal.settings, key)) {
        if (
          !this.ignorableAttrs.includes(key) &&
          !this.ignorableAttrs.includes(camelize(key))
        ) {
          // TODO: Add better ember keys here
          // eslint-disable-next-line no-console
          console.log(
            `You passed in the property '${key}', but a setting doesn't exist on the Semantic UI module: ${this.moduleName}`
          );
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
        custom[key] = bind(this, this._updateFunctionWithParameters(value));
      }
      if (typeof value === "object") {
        if (isHTMLSafe(value)) {
          custom[key] = this._unwrapHTMLSafe(value);
        }
      }
    }

    return custom;
  }

  _updateFunctionWithParameters(fn) {
    return function () {
      let args = [].splice.call(arguments, 0);
      // always add component instance as the last parameter in case they need access to it
      args.push(this);

      if (this.initialized) {
        return fn.apply(this, args);
      }
    };
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

  //TODO update

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
}
