/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiEmbedComponent extends Component.extend(Base) {
  module = "embed";
  classNames = ["ui", "embed"];
  attributeBindings = [
    "data-icon",
    "data-id",
    "data-placeholder",
    "data-source",
    "data-url"
  ];
  ignorableAttrs = [
    "data-icon",
    "data-id",
    "data-placeholder",
    "data-source",
    "data-url"
  ];
}
