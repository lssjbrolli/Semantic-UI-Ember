/* eslint-disable ember/no-jquery */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import $ from "jquery";

export default class extends Controller {
  @action
  transition() {
    $("img").transition("horizontal flip", "500ms");
  }
}
