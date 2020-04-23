import BaseComponent from "./base";

export default class UiPopupComponent extends BaseComponent {
  module = "popup";

  didInitSemantic() {
    super.didInitSemantic(...arguments);
    let possibleAttrs = ["content", "title", "html"];
    for (let i = 0; i < possibleAttrs.length; i++) {
      let possibleAttr = possibleAttrs[i];
      if (this.args[possibleAttr] || this.possibleAttr != null) {
        this.settableAttrs.push(possibleAttr);
      }
    }
    if (this.args.position) {
      let arr = this.settableAttrs;
      arr.splice(arr.indexOf("position"), 1);
    }
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
              content: value,
            };
          } else {
            text = {
              title: value,
              content: this.content,
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
