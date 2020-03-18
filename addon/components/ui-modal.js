/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiModalComponent extends Component.extend(Base) {
  module = "modal";
  classNames = ["ui", "modal"];

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
