import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, find } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui sticky", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(3);

    await render(hbs`
      <UiSticky >
        <p>Some text</p>
      </UiSticky >
    `);

    assert.dom(".ui.sticky").exists({ count: 1 });
    assert.ok(find(".ui.sticky").style.width !== undefined);
    assert.ok(find(".ui.sticky").style.height !== undefined);
  });
});
