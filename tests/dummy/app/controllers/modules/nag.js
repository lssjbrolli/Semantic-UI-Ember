/* eslint-disable ember/no-jquery */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import $ from "jquery";

export default class extends Controller {
  @action
  clear() {
    $(".cookie.nag").nag("clear");
    $(".cookie.nag").nag("show");
  }
}
