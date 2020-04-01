import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, find } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui progress", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders with percent", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <UiProgress @percent={{40}} class="teal indicating" >
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "40");
  });

  test("it renders with value", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <UiProgress @value={{40}} class="teal indicating" >
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "40");
  });

  test("binding updates precent progress", async function(assert) {
    assert.expect(4);

    this.set("progress", 40);
    await render(hbs`
      <UiProgress @percent={{this.progress}} class="teal indicating">
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "40");
    let width = find(".ui.progress .bar").style.width;
    this.set("progress", 60);

    let done = assert.async();

    setTimeout(() => {
      assert.dom(".ui.progress").hasAttribute("data-percent", "60");
      assert.notEqual(find(".ui.progress .bar").style.width, width);

      done();
    }, 500);
  });

  test("binding updates precent progress with total", async function(assert) {
    assert.expect(4);

    this.set("progress", 40);
    await render(hbs`
      <UiProgress @percent={{this.progress}} @total={{30}} class="teal indicating">
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "40");
    let width = find(".ui.progress .bar").style.width;
    this.set("progress", 60);

    let done = assert.async();

    setTimeout(() => {
      assert.dom(".ui.progress").hasAttribute("data-percent", "60");
      assert.notEqual(find(".ui.progress .bar").style.width, width);

      done();
    }, 500);
  });

  test("binding updates progress", async function(assert) {
    assert.expect(4);

    this.set("value", 50);
    await render(hbs`
      <UiProgress @value={{this.value}} @progress={{this.value}} class="teal indicating">
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "50");
    let width = find(".ui.progress .bar").style.width;
    this.set("value", 70);

    let done = assert.async();

    setTimeout(() => {
      assert.dom(".ui.progress").hasAttribute("data-percent", "70");
      assert.notEqual(find(".ui.progress .bar").style.width, width);

      done();
    }, 500);
  });

  test("binding updates progress with total", async function(assert) {
    assert.expect(4);

    this.set("value", 15);
    await render(hbs`
      <UiProgress @value={{this.value}} @progress={{this.value}} @total={{30}} class="teal indicating">
        <div class="bar"></div>
        <div class="label">Completed</div>
      </UiProgress >
    `);

    assert.dom(".ui.progress").exists({ count: 1 });
    assert.dom(".ui.progress").hasAttribute("data-percent", "50");
    let width = find(".ui.progress .bar").style.width;
    this.set("value", 21);

    let done = assert.async();

    setTimeout(() => {
      assert.dom(".ui.progress").hasAttribute("data-percent", "70");
      assert.notEqual(find(".ui.progress .bar").style.width, width);

      done();
    }, 500);
  });
});
