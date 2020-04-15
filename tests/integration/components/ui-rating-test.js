import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui rating", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(3);

    await render(hbs`
      <UiRating @initialRating={{3}} @maxRating={{6}} />
    `);

    assert.dom(".ui.rating").exists({ count: 1 });
    assert.dom(".ui.rating i").exists({ count: 6 });
    assert.dom(".ui.rating .active").exists({ count: 3 });
  });

  test("it updates with bound values", async function (assert) {
    assert.expect(4);

    this.set("rating", 3);
    await render(hbs`
      <UiRating @initialRating={{this.rating}} @rating={{this.rating}} @maxRating={{7}} />
    `);
    assert.dom(".ui.rating").exists({ count: 1 });
    assert.dom(".ui.rating i").exists({ count: 7 });
    assert.dom(".ui.rating .active").exists({ count: 3 });

    this.set("rating", 6);
    assert.dom(".ui.rating .active").exists({ count: 6 });
  });

  test("clicking updates with bound values", async function (assert) {
    assert.expect(5);

    this.set("rating", 3);
    await render(hbs`
      <UiRating @initialRating={{this.rating}} @rating={{this.rating}} @maxRating={{7}} @onRate={{fn (mut this.rating)}} />
    `);

    assert.dom(".ui.rating").exists({ count: 1 });
    assert.dom(".ui.rating i").exists({ count: 7 });
    assert.dom(".ui.rating .active").exists({ count: 3 });

    await click(".ui.rating i:nth-child(4)");
    assert.dom(".ui.rating .active").exists({ count: 4 });
    assert.equal(4, this.rating);
  });

  test("clicking updates with bound values and clicking again clears", async function (assert) {
    assert.expect(7);

    this.set("rating", 3);
    await render(hbs`
      <UiRating @initialRating={{this.rating}} @rating={{this.rating}} @onRate={{fn (mut this.rating)}} @clearable={{true}} />
    `);

    assert.dom(".ui.rating").exists({ count: 1 });
    assert.dom(".ui.rating i").exists({ count: 4 });
    assert.dom(".ui.rating .active").exists({ count: 3 });

    await click(".ui.rating i:nth-child(4)");
    assert.dom(".ui.rating .active").exists({ count: 4 });
    assert.equal(4, this.rating);

    await click(".ui.rating i:nth-child(4)");
    assert.dom(".ui.rating .active").doesNotExist();
    assert.equal(0, this.rating);
  });
});
