import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui shape", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);

    await render(hbs`
      <UiShape>
        <p>Content</p>
      </UiShape>
    `);

    assert.dom(".ui.shape").exists({ count: 1 });
  });
});
