import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class extends Component {
  @tracked showing = false;
  @tracked code;

  @action
  toggle() {
    this.showing = !this.showing;
  }
  @action
  setCode(code) {
    this.code = code;
  }
}
