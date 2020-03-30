import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, findAll } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui sidebar", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders as sub context", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <div class="component context">
        <UiSidebar @context=".component.context">
          <a class="item">1</a>
          <a class="item">2</a>
          <a class="item">3</a>
        </UiSidebar>
        <div class="pusher">
          Main Content here
        </div>
      </div>
    `);

    assert.equal(findAll(".ui.sidebar").length, 1);
    assert.equal(findAll(".ui.sidebar a").length, 3);
  });
});
