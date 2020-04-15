import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  render,
  click,
  getRootElement,
  triggerEvent,
} from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui dimmer", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);
    // Template block usage:
    await render(hbs`
      <UiDimmer class="ui segment" >
        template block text
      </UiDimmer>
    `);
    assert.dom(".ui.segment .ui.dimmer").exists({ count: 1 });
  });

  test("dimmer shows and hides on click", async function (assert) {
    assert.expect(6);

    await render(hbs`
      <UiDimmer class="ui segment" @on="click" @duration={{hash show=0 hide=0}} >
        template block text
      </UiDimmer>
    `);

    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer found");
    assert
      .dom(".ui.segment .ui.dimmer.active")
      .doesNotExist("UI Dimmer shouldn't be active");

    await click(".ui.segment");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .exists({ count: 1 }, "Active UI Dimmer was found");

      await click(".ui.segment");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .doesNotExist("UI Dimmer shouldn't be active");
        done();
      }, 100);
    }, 100);
  });

  test("dimmer shows and hides on hover", async function (assert) {
    assert.expect(6);
    // Template block usage:
    await render(hbs`
      <UiDimmer class="ui segment" @on="hover" @duration={{hash show=0 hide=0}} >
        template block text
      </UiDimmer>
    `);

    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer found");
    assert
      .dom(".ui.segment .ui.dimmer.active")
      .doesNotExist("UI Dimmer shouldn't be active");

    await triggerEvent(".ui.segment", "mouseover");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer found");

      assert
        .dom(".ui.segment .ui.dimmer.active")
        .exists({ count: 1 }, "Active UI Dimmer was found");

      await triggerEvent(".ui.segment", "mouseout");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .doesNotExist("UI Dimmer shouldn't be active");
        done();
      }, 100);
    }, 100);
  });

  test("dimmer only works on scoped element for shows and hides on click", async function (assert) {
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
      .doesNotExist("UI Dimmer should not be a direct child");
    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer was found under segment");

    await click(".dimmer");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .doesNotExist("UI Dimmer shouldn't be active");

      await click(".ui.segment");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .exists({ count: 1 }, "UI Dimmer is active");
        done();
      }, 100);
    }, 100);
  });

  test("dimmer shows and hides from composable action", async function (assert) {
    assert.expect(6);

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
      .doesNotExist("UI Dimmer should not be a direct child");
    assert
      .dom(".ui.segment .ui.dimmer")
      .exists({ count: 1 }, "UI Dimmer was found under segment");

    await click("[data-id=show]");

    let done = assert.async();
    setTimeout(async () => {
      assert
        .dom(".ui.segment .ui.dimmer")
        .exists({ count: 1 }, "UI Dimmer found");
      assert
        .dom(".ui.segment .ui.dimmer.active")
        .exists({ count: 1 }, "UI Dimmer is active");

      await click("[data-id=hide]");

      setTimeout(() => {
        assert
          .dom(".ui.segment .ui.dimmer")
          .exists({ count: 1 }, "UI Dimmer found");
        assert
          .dom(".ui.segment .ui.dimmer.active")
          .doesNotExist("UI Dimmer should not be active");
        done();
      }, 100);
    }, 100);
  });
});
