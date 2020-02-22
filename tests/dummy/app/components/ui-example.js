import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class extends Component {
  @tracked showing = false;

  @action
  toggle() {
    this.showing = !this.showing;
  }
}
