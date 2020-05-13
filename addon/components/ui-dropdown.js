import BaseComponent from "./base";
import { isArray } from "@ember/array";
import { isEmpty, isBlank } from "@ember/utils";
import { action } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { guidFor } from "@ember/object/internals";
import { resolve } from "rsvp";

const _proxyCallback = function (callbackName) {
  return function (value, text, $element) {
    return this.args[callbackName](
      this._getObjectOrValue(value),
      text,
      $element,
      this
    );
  };
};

export default class UiDropdownComponent extends BaseComponent {
  module = "dropdown";
  ignorableAttrs = ["selected"];
  objectMap = {};

  willDestroyElement() {
    super.willDestroyElement(...arguments);
    this.objectMap = null;
  }

  // Semantic Hooks
  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.onChange) {
      settings.onChange = this._onChange;
    }
    if (settings.onAdd) {
      settings.onAdd = this._onAdd;
    }
    if (settings.onRemove) {
      settings.onRemove = this._onRemove;
    }
  }

  didInitSemantic() {
    super.didInitSemantic(...arguments);
    // We want to handle this outside of the standard process
    let arr = this.settableAttrs;
    arr.splice(arr.indexOf("selected"), 1);
    // We need to ensure the internal value is set to '',
    // otherwise when we get the value later it is undefined
    // and semantic returns the module instead of the actual value
    this.execute("clear");
    this._inspectSelected();
  }

  @action
  updateModule() {
    super.updateModule(...arguments);
    this._inspectSelected();
  }

  @action
  mapping(object) {
    let guid = guidFor(object);
    if (!this._hasOwnProperty(this.objectMap, guid)) {
      this.objectMap[guid] = object;
    }
    scheduleOnce("afterRender", this, this._inspectSelected);

    return guid;
  }

  // Method proxies
  _onChange(value, text, $element) {
    // Semantic calls the events on any 'set {action}'
    // Because of that we want to ignore calls when we are
    // Specifically setting the value
    if (this._isSettingSelect) {
      return;
    }
    let returnValue;
    if (this.execute("is multiple")) {
      let values = this.execute("get values");
      returnValue = [];
      for (let i = 0; i < values.length; i++) {
        let item = this._atIndex(values, i);
        returnValue.push(this._getObjectOrValue(item));
      }
    } else {
      returnValue = this._getObjectOrValue(value);
    }

    return this.args.onChange(returnValue, text, $element, this);
  }
  _onAdd = _proxyCallback("onAdd");
  _onRemove = _proxyCallback("onRemove");

  // Private methods
  _atIndex(collection, index) {
    if (typeof collection.objectAt === "function") {
      return collection.objectAt(index);
    }
    return collection[index];
  }

  _getObjectOrValue(value) {
    if (this._hasOwnProperty(this.objectMap, value)) {
      return this.objectMap[value];
    }
    if (isEmpty(value)) {
      return null;
    }
    return value;
  }

  _inspectSelected() {
    let selected = this.args.selected;

    return resolve(selected).then((value) => this._checkSelected(value));
  }

  _checkSelected(selectedValue) {
    let isMultiple = this.execute("is multiple");
    let moduleSelected = this._getCurrentSelected(isMultiple);

    if (!this._areSelectedEqual(selectedValue, moduleSelected, isMultiple)) {
      this._isSettingSelect = true;
      this._setCurrentSelected(selectedValue, moduleSelected, isMultiple);
      this._isSettingSelect = false;
    }
  }

  _getCurrentSelected(isMultiple) {
    if (isMultiple) {
      let keys = this.execute("get values");
      let returnValues = [];
      for (let i = 0; i < keys.length; i++) {
        let key = this._atIndex(keys, i);
        returnValues.push(this._getObjectOrValue(key));
      }
      return returnValues;
    }

    let key = this.execute("get value");
    return this._getObjectOrValue(key);
  }

  _setCurrentSelected(selectedValue, moduleSelected, isMultiple) {
    if (isBlank(selectedValue)) {
      if (!isBlank(moduleSelected)) {
        this.execute("clear");
      }
      return;
    }

    if (isArray(selectedValue)) {
      let keys = [];
      if (!isMultiple) {
        // eslint-disable-next-line no-console
        console.log(
          "Selected is an array of values, but the dropdown doesn't have the class 'multiple'"
        );
        return;
      }

      for (let i = 0; i < selectedValue.length; i++) {
        let item = this._atIndex(selectedValue, i);
        keys.push(this._getObjectKeyByValue(item));
      }

      return this.execute("set exactly", keys);
    }

    let key = this._getObjectKeyByValue(selectedValue);
    return this.execute("set selected", key);
  }

  _areSelectedEqual(selectedValue, moduleValue, isMultiple) {
    if (isMultiple) {
      // If selectedValue passed in is an array, we are assuming that its the collection getting updated and that
      // all module values must equal the attrValues

      // If both are in a blank state of some kind, they are equal.
      // i.e. selected could be null and moduleValue could be an empty array
      if (isBlank(selectedValue) && isBlank(moduleValue)) {
        return true;
      }

      if (isArray(selectedValue)) {
        if (selectedValue.length !== moduleValue.length) {
          return false;
        }

        // Loop through the collections and see if they are equal
        for (let i = 0; i < selectedValue.length; i++) {
          let value = this._atIndex(selectedValue, i);
          let equal = false;
          for (let j = 0; j < moduleValue.length; j++) {
            let module = this._atIndex(moduleValue, j);
            if (this.areAttrValuesEqual("selected", value, module)) {
              equal = true;
              break;
            }
          }
          if (!equal) {
            return false;
          }
        }
        // If we didn't return, the arrays are equal
        return true;
      }
      // otherwise, just try to see one of the values in the module equals the attr value
      // The use case is the selected value is a single value to start, then the module value is an array
      else if (isArray(moduleValue)) {
        for (let i = 0; i < moduleValue.length; i++) {
          let item = this._atIndex(moduleValue, i);
          if (this.areAttrValuesEqual("selected", selectedValue, item)) {
            return true; // We found a match, just looking for one
          }
        }
        return false;
      }
    }

    return this.areAttrValuesEqual("selected", selectedValue, moduleValue);
  }

  _getObjectKeyByValue(value) {
    // Since semantic is always binding to strings, we must return a string
    // Either through the object mapping or directly stringed value
    let objectMap = this.objectMap;
    for (let key in objectMap) {
      if (objectMap[key] === value) {
        return key;
      }
    }
    if (value == null) {
      return "";
    }
    return value.toString();
  }
}
