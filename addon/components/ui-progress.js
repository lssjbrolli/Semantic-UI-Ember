/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiProgressComponent extends Component.extend(Base) {
  module = "progress";
  classNames = ["ui", "progress"];
  ignorableAttrs = ["progress"];
}
