import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(2);

    let count = 0;
    this.changed = () => {
      count++;
    };

    this.checked = false;
    await render(hbs`
      <UiCheckbox @label="Make my profile visible" @checked={{this.checked}} @onChange={{fn this.changed}} />
    `);

    assert.dom(".ui.checkbox").exists({ count: 1 });
    assert.equal(count, 0, "onChange should not have been called");
  });

  test("checking will update the bound property", async function (assert) {
    assert.expect(3);

    let count = 0;
    this.set("changed", (value) => {
      this.set("checked", value);
      count++;
    });
    this.set("checked", false);

    await render(hbs`
      <UiCheckbox @label="Make my profile visible" @checked={{this.checked}} @onChange={{fn this.changed}} />
    `);

    assert.dom(".ui.checkbox").exists({ count: 1 });
    await click(".ui.checkbox");
    assert.equal(true, this.checked);
    assert.equal(count, 1, "onChange should have only been called once");
  });

  test("setting disabled ignores click", async function (assert) {
    assert.expect(4);

    let count = 0;
    this.set("changed", (value) => {
      this.set("checked", value);
      count++;
    });
    this.set("checked", false);
    this.set("disabled", true);

    await render(hbs`
      <UiCheckbox @label="Make my profile visible" @checked={{this.checked}} @disabled={{this.disabled}} @onChange={{fn this.changed}} />
    `);

    assert.dom(".ui.checkbox").exists({ count: 1 });
    await click(".ui.checkbox");
    assert.equal(false, this.checked);

    // await this.pauseTest();

    this.set("disabled", false);
    await click(".ui.checkbox");
    assert.equal(true, this.checked);
    assert.equal(count, 1, "onChange should have only been called once");
  });

  test("setting readonly ignores click", async function (assert) {
    assert.expect(4);

    let count = 0;
    this.set("changed", (value) => {
      this.set("checked", value);
      count++;
    });
    this.set("checked", false);
    this.set("readonly", true);

    await render(hbs`
      <UiCheckbox @label="Make my profile visible" @checked={{this.checked}} @readonly={{this.readonly}} @onChange={{fn this.changed}} />
    `);

    assert.dom(".ui.checkbox").exists({ count: 1 });
    await click(".ui.checkbox");
    assert.equal(false, this.checked);

    this.set("readonly", false);
    await click(".ui.checkbox");
    assert.equal(true, this.checked);
    assert.equal(count, 1, "onChange should have only been called once");
  });
});
