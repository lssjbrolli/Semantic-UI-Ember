import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, getRootElement } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui dimmer", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);
    // Template block usage:
    await render(hbs`
      <UiDimmer class="ui segment" >
        template block text
      </UiDimmer>
    `);

    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer not found");
  });

  test("dimmer shows and hides on click", async function(assert) {
    assert.expect(6);
    // Template block usage:
    await render(hbs`
      <UiDimmer class="ui segment" @on="click" @duration={{hash show=0 hide=0}} >
        template block text
      </UiDimmer>
    `);

    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer not found");
    assert
      .dom(".ui.segment .ui.dimmer.active")
      .doesNotExist("An active UI Dimmer was found and shouldn't be");
    await click(".ui.segment");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer not found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .exists({ count: 1 }, "No active UI Dimmer was found"); //broken
      await click(".ui.segment");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer not found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .doesNotExist("An active UI Dimmer was found and shouldn't be");
        done();
      }, 100);
    }, 100);
  });

  test("dimmer only works on scoped element for shows and hides on click", async function(assert) {
    assert.expect(6);
    // Template block usage:
    await render(hbs`
      <UiDimmer @on="click" @onElement=".ui.segment" @duration={{hash show=0 hide=0}} >
        <div class="ui segment">
          template block text
        </div>
      </UiDimmer>
    `);

    assert
      .dom(`#${getRootElement().id} > .ui.dimmer`)
      .doesNotExist("UI Dimmer was found as a direct child");
    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer was not found under segment");
    await click(".dimmer");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer not found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .doesNotExist("An active UI Dimmer was found");
      await click(".ui.segment");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer not found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .exists({ count: 1 }, "An active UI Dimmer was not found"); // broken
        done();
      }, 100);
    }, 100);
  });

  test("dimmer shows and hides from composable action", async function(assert) {
    assert.expect(6);
    // Template block usage:
    await render(hbs`
      <UiDimmer @on="click" @onElement=".ui.segment" @duration={{hash show=0 hide=0}} as |execute|>
        <div class="ui button" {{on 'click' (fn  execute "show")}} data-id="show">Show</div>
        <div class="ui button" {{on 'click' (fn  execute "hide")}} data-id="hide">Hide</div>
        <div class="ui segment">
          template block text
        </div>
      </UiDimmer>
    `);

    assert
      .dom(`#${getRootElement().id} > .ui.dimmer`)
      .doesNotExist("UI Dimmer was found as a direct child");
    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer was not found under segment");
    await click("[data-id=show]");

    let done = assert.async();

    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer not found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .exists({ count: 1 }, "An active UI Dimmer was not found");
      await click("[data-id=hide]");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer not found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .doesNotExist("An active UI Dimmer was found");
        done();
      }, 100);
    }, 100);
  });
});
