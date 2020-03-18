/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiSearchComponent extends Component.extend(Base) {
  module = "search";
  classNames = ["ui", "search"];

  didInitSemantic(...args) {
    super.didInitSemantic(...args);
    this._bindableAttrs.addObject("source");
  }
  execute(...args) {
    const cmd = args[0];
    const attrValue = args[1];

    if (cmd === "set source") {
      let module = this.getSemanticModule();
      if (module) {
        return module.apply(this.getSemanticScope(), [
          {
            source: attrValue
          }
        ]);
      }
    }
    return super.execute(...args);
  }
}
