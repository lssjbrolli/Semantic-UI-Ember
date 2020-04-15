/* eslint-disable ember/no-jquery */
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  render,
  focus,
  find,
  fillIn,
  triggerKeyEvent,
} from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import $ from "jquery";

module("Integration | Component | ui search", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <UiSearch @apiSettings={{hash url="/search"}} >
        <input class="prompt" type="text" placeholder="Common passwords...">
        <div class="results"></div>
      </UiSearch>
    `);

    assert.dom(".ui.search").exists({ count: 1 });
  });

  test("searching content works", async function (assert) {
    assert.expect(5);

    this.set("commonPasswords", [{ title: "bobby" }, { title: "12345" }]);

    this.set("query", null);
    this.set("selected", null);

    this.set("setValue", (value) => {
      this.set("selected", value);
    });

    await render(hbs`
      <UiSearch @source={{this.commonPasswords}} @onSelect={{fn this.setValue}}>
        <Input
          @value={{this.query}}
          class="prompt"
          type="text"
          placeholder="Common passwords..."
        />
        <div class="results"></div>
      </UiSearch>
    `);

    assert.dom(".ui.search").exists({ count: 1 });
    assert.equal(this.query, null);
    assert.equal(this.selected, null);

    await focus("input");
    await fillIn("input", "123");

    $(".ui.search").search("query");

    assert.equal(this.query, "123");

    $(".ui.search").search("show results");

    let done = assert.async();

    setTimeout(async () => {
      find(".result").classList.add("active");
      await triggerKeyEvent(find("input"), "keydown", 13);

      assert.equal(this.selected.title, "12345");
      done();
    }, 500);
  });
});
