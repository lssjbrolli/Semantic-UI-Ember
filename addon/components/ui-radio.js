/* eslint-disable ember/no-component-lifecycle-hooks */
/* eslint-disable no-console */
/* eslint-disable ember/no-attrs-in-components */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import { hash } from "rsvp";
import { isBlank } from "@ember/utils";
import Component from "@ember/component";
import Checkbox from "../mixins/checkbox";
import isPromise from "ember-promise-utils/utils/is-promise";
import isFulfilled from "ember-promise-utils/utils/is-fulfilled";
import getPromiseContent from "ember-promise-utils/utils/get-promise-content";
import PromiseResolver from "ember-promise-utils/mixins/promise-resolver";

export default class UiRadioComponent extends Component.extend(
  Checkbox,
  PromiseResolver
) {
  type = "radio";
  classNames = ["ui radio"];
  ignorableAttrs = ["checked", "label", "disabled", "value", "current"];

  constructor() {
    super(...arguments);

    if (isBlank(this.name)) {
      this.name = "default";

      console.log(
        "The required component parameter of 'name' was not passed into the ui-radio component"
      );
    }
  }

  // Internal wrapper for onchange, to pass through checked
  _onChange() {
    let value = this.value;
    return this.attrs.onChange(value, this);
  }

  didInitSemantic() {
    super.didInitSemantic(...arguments);
    this._inspectValueAndCurrent();
  }

  didUpdateAttrs() {
    super.didUpdateAttrs(...arguments);
    this._inspectValueAndCurrent();
  }

  _inspectValueAndCurrent() {
    let value = this.value;
    let current = this.current;
    // If either are a promise, we need to make sure both are resolved
    // Or wait for them to resolve
    if (isPromise(value) || isPromise(current)) {
      // This code is probably overkill, but i wanted to ensure that
      // if the promises are resolved we render as soon as possible instead of waiting
      // for the hash to resolve each time
      if (isPromise(value)) {
        if (!isFulfilled(value)) {
          return this.resolvePromise(
            hash({ value, current }),
            this._checkValueAndCurrent
          );
        } else {
          value = getPromiseContent(value);
        }
      }

      if (isPromise(current)) {
        if (!isFulfilled(current)) {
          return this.resolvePromise(
            hash({ value, current }),
            this._checkValueAndCurrent
          );
        } else {
          current = getPromiseContent(current);
        }
      }
    }
    // If we didn't return, the promises are either fulfilled or not promises
    this._checkValueAndCurrent({ value, current });
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
