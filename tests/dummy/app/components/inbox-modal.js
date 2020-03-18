/* eslint-disable ember/require-tagless-components */
/* global alert */
import UiModal from "semantic-ui-ember/components/ui-modal";
import { action } from "@ember/object";

export default class extends UiModal {
  name = "inbox";
  classNames = ["inbox"];

  @action
  yes() {
    alert("yes");
    this.execute("hide");
  }
  @action
  no() {
    alert("no");
  }
}
