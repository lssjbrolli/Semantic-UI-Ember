import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class extends Controller {
  @tracked total_sections = 0;

  get sections() {
    let sections = [];
    let count = this.total_sections;
    while (count) {
      sections.push(count);
      count -= 1;
    }
    return sections.sort();
  }

  @action
  change_sections(value) {
    let total_sections = this.total_sections;
    if (total_sections + value < 0) {
      return;
    }
    this.total_sections = total_sections + value;
  }
}
