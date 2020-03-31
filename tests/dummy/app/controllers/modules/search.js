import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class extends Controller {
  @tracked query;
  @tracked selected;

  @action
  setValue(v) {
    this.selected = v;
  }

  commonPasswords = [
    { title: "password" },
    { title: "123456" },
    { title: "12345678" },
    { title: "1234" },
    { title: "qwerty" },
    { title: "12345" },
    { title: "dragon" },
    { title: "heart" },
    { title: "baseball" },
    { title: "football" },
    { title: "letmein" },
    { title: "monkey" },
    { title: "696969" },
    { title: "abc123" },
    { title: "mustang" },
    { title: "michael" },
    { title: "shadow" },
    { title: "master" },
    { title: "jennifer" },
    { title: "111111" }
  ];
}
