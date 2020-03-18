import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, focus, findAll, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui search", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#ui-search apiSettings=(hash url="/search")}}
        <input class="prompt" type="text" placeholder="Common passwords...">
        <div class="results"></div>
      {{/ui-search}}
    `);

    assert.equal(findAll(".ui.search").length, 1);
  });

  test("searching content works", async function(assert) {
    assert.expect(5);

    this.set("commonPasswords", [{ title: "bobby" }, { title: "12345" }]);

    this.set("query", null);
    this.set("selected", null);

    await render(hbs`
      {{#ui-search source=commonPasswords onSearchQuery=(action (mut query)) onSelect=(action (mut selected))}}
        <input class="prompt" type="text" placeholder="Common passwords...">
        <div class="results"></div>
      {{/ui-search}}
    `);

    assert.equal(findAll(".ui.search").length, 1);
    assert.equal(this.query, null);
    assert.equal(this.selected, null);

    await focus("input");
    await fillIn("input", "123");
    this.$(".ui.search").search("query");

    assert.equal(this.query, "123");

    this.$(".ui.search").search("show results");

    let done = assert.async();

    setTimeout(() => {
      this.$(".result").addClass("active");
      this.$("input").trigger(window.jQuery.Event("keydown", { which: 13 }));

      assert.equal(this.get("selected.title"), "12345");
      done();
    }, 500);
  });
});
