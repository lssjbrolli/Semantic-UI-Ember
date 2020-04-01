import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui embed", function(hooks) {
  setupRenderingTest(hooks);

  test("it embeds youtube by id", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <UiEmbed data-source="youtube" data-id="pfdu_gTry8E" />
    `);

    assert.dom(".ui.embed .embed iframe").exists({ count: 1 });
    assert.dom(".ui.embed .embed iframe").hasAttribute("src", /youtube.com/);
  });

  test("it embeds through a url", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <UiEmbed data-url="https://www.youtube.com/embed/pfdu_gTry8E" />
    `);

    assert.dom(".ui.embed .embed iframe").exists({ count: 1 });
    assert.dom(".ui.embed .embed iframe").hasAttribute("src", /youtube.com/);
  });

  test("embeds works through parameters", async function(assert) {
    assert.expect(2);

    await render(hbs`
      <UiEmbed data-url="https://www.youtube.com/embed/pfdu_gTry8E"/>
    `);

    assert.dom(".ui.embed .embed iframe").exists({ count: 1 });
    assert.dom(".ui.embed .embed iframe").hasAttribute("src", /youtube.com/);
  });
});
