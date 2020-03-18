/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import BaseMixin from "semantic-ui-ember/mixins/base";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, find } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

let baseComponent = class extends Component.extend(BaseMixin) {
  module = "test";

  initSemanticModule() {
    // Do nothing
  }
  didInitSemantic() {
    // Do nothing
  }
  execute(command) {
    if (command === "internal") {
      return {};
    }
  }
};

module("Unit | Component | base component", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register("component:base-component", baseComponent);
  });

  test("it renders and has right properties", async function(assert) {
    assert.expect(3);

    await render(hbs`
      <BaseComponent class="base-component" title="semantic ui ember" tabindex={{5}} autofocus={{true}} />`);

    let component = find(".base-component");

    assert.equal(component.getAttribute("title"), "semantic ui ember");
    assert.equal(component.getAttribute("tabindex"), "5");
    assert.ok(component.hasAttribute("autofocus"));
  });
});
