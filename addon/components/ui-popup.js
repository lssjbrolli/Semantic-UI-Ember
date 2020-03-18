/* eslint-disable ember/no-attrs-in-components */
/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiPopupComponent extends Component.extend(Base) {
  module = "popup";

  didInitSemantic() {
    super.didInitSemantic(...arguments);
    let possibleAttrs = ["content", "title", "html"];
    for (let i = 0; i < possibleAttrs.length; i++) {
      let possibleAttr = possibleAttrs[i];
      if (
        this._hasOwnProperty(this.attrs, possibleAttr) ||
        this.possibleAttr != null
      ) {
        this._settableAttrs.addObject(possibleAttr);
      }
    }
    this._settableAttrs.removeObject("position");
  }

  setSemanticAttr(attrName, attrValue) {
    if (attrName === "content" || attrName === "title" || attrName === "html") {
      let value = this._unwrapHTMLSafe(attrValue);
      let response = this.execute("setting", attrName, value);
      if (this.execute("is visible")) {
        let html;
        if (attrName === "html") {
          html = value;
        } else {
          let text;
          if (attrName === "content") {
            text = {
              title: this.title,
              content: value
            };
          } else {
            text = {
              title: value,
              content: this.content
            };
          }
          let moduleGlobal = this.getSemanticModuleGlobal();
          html = moduleGlobal.settings.templates.popup(text);
        }
        this.execute("change content", html);
      }
      return response;
    }
    return super.setSemanticAttr(...arguments);
  }
}
