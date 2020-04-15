import BaseComponent from "./base";

export default class UiSearchComponent extends BaseComponent {
  module = "search";

  execute() {
    const cmd = arguments[0];
    const attrValue = arguments[1];

    if (cmd === "set source") {
      let module = this.getSemanticModule();
      if (module) {
        return module.apply(this.getSemanticScope(), [
          {
            source: attrValue,
          },
        ]);
      }
    }
    return super.execute(...arguments);
  }
}
