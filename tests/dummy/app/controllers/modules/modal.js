/* eslint-disable ember/no-jquery */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import $ from "jquery";

export default class extends Controller {
  @action
  openModal(name) {
    $(".ui." + name + ".modal").modal("show");
  }

  @action
  approveModal(element, component) {
    alert("approve " + component.args.name);
    return false;
  }

  @action
  denyModal(element, component) {
    alert("deny " + component.args.name);
    return true;
  }
}
