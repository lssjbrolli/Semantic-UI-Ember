/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiNagComponent extends Component.extend(Base) {
  module = "nag";
  classNames = ["ui", "nag"];
}
