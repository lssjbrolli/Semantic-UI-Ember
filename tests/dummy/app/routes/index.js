import Route from "@ember/routing/route";

export default class extends Route {
  redirect() {
    this.replaceWith("modules.index");
  }
}
