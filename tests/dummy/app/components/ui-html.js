import { later } from "@ember/runloop";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

const copyMessage = "Copy Code";

export default class extends Component {
  @tracked copyMessage = copyMessage;

  @action
  copied() {
    this.copyMessage = "Copied to Clipboard";
    later(this, () => (this.copyMessage = copyMessage), 1000);
  }
  @action
  copyError() {
    this.copyMessage = "There was an error copying to Clipboard";
    later(this, () => (this.copyMessage = copyMessage), 1000);
  }
}
