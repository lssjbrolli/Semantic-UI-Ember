import BaseComponent from "./base";

export default class UiModalComponent extends BaseComponent {
  module = "modal";

  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.detachable == null) {
      settings.detachable = false;
    }
    if (settings.observeChanges == null) {
      settings.observeChanges = true;
    }
  }
}
