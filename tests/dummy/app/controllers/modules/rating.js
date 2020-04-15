import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class extends Controller {
  @tracked rating = 3;
  heartRating = 1;

  @action
  inc() {
    this.rating--;
  }
}
