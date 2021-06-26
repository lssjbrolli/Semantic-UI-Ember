/* eslint-disable ember/no-jquery */
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import $ from 'jquery'

module("Integration | Component | ui nag", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <UiNag class="inline cookie">
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      </UiNag>
    `);

    assert.dom(".ui.nag").exists({ count: 1 });
  });

  test("it will only show once", async function (assert) {
    assert.expect(4);

    await render(hbs`
      <UiNag class="inline cookie">
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      </UiNag>
    `);

    assert.dom(".ui.nag").exists({ count: 1 });
    $(".ui.nag").nag("clear");
    $(".ui.nag").nag("show");
    assert.dom(".ui.nag").hasStyle({
      display: "block",
    });

    await click(".ui.nag .close");

    let done = assert.async();
    setTimeout(() => {
      assert.dom(".ui.nag").hasStyle({
        display: "none",
      });
      $(".ui.nag").nag("show");
      assert.dom(".ui.nag").hasStyle({
        display: "block",
      });
      done();
    }, 1000);
  });
});
