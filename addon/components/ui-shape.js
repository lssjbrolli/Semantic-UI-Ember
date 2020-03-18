/* eslint-disable ember/no-classic-components */
/* eslint-disable ember/require-tagless-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiShapeComponent extends Component.extend(Base) {
  module = "shape";
  classNames = ["ui", "shape"];
}
