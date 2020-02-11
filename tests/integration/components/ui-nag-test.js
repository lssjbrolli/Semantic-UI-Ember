import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, find, findAll } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | ui nag", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#ui-nag class="inline cookie"}}
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      {{/ui-nag}}
    `);

    assert.equal(findAll(".ui.nag").length, 1);
  });

  test("it will only show once", async function(assert) {
    assert.expect(4);

    await render(hbs`
      {{#ui-nag class="inline cookie"}}
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      {{/ui-nag}}
    `);

    assert.equal(findAll(".ui.nag").length, 1);
    this.$(".ui.nag").nag("clear");
    this.$(".ui.nag").nag("show");
    assert.equal(find(".ui.nag").style.display, "block");
    await click(".ui.nag .close");

    let done = assert.async();

    setTimeout(() => {
      assert.equal(find(".ui.nag").style.display, "none");
      this.$(".ui.nag").nag("show");
      assert.equal(find(".ui.nag").style.display, "block");

      done();
    }, 1000);
  });
});
