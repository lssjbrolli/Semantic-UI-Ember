/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import { action } from "@ember/object";
import Base from "../mixins/base";

export default class UiDimmerComponent extends Component.extend(Base) {
  module = "dimmer";

  @action
  exec() {
    return this.execute(...arguments);
  }
}
