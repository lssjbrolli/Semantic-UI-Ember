/* eslint-disable ember/no-jquery */
import { htmlSafe } from "@ember/template";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, find } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | ui popup", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <UiPopup @content="Add users to your feed">
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    assert.equal(
      this.$("div").popup("get content")[0],
      "Add users to your feed"
    );
  });

  test("updating content updates popup", async function (assert) {
    assert.expect(2);

    this.set("content", "This is dynamic content");
    await render(hbs`
      <UiPopup @content={{this.content}} >
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    assert.equal(
      this.$("div").popup("get content")[0],
      "This is dynamic content"
    );

    this.set("content", "Now it magically changed!");

    assert.equal(
      this.$("div").popup("get content")[0],
      "Now it magically changed!"
    );
  });

  test("title works with attribute bindings and popup title", async function (assert) {
    assert.expect(2);

    await render(hbs`
      <UiPopup @content="Add users to your feed" @title="A title" >
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    this.$("div").popup("show");
    let done = assert.async();

    setTimeout(() => {
      assert.equal(window.$(".ui.popup").length, 1);
      let popup = window.$(".ui.popup");

      assert.equal(popup.find(".header").text(), "A title");
      // This isn't working right at the moment
      // https://github.com/Semantic-Org/Semantic-UI/pull/4614
      // assert.equal(popup.find('.content').text(), 'A title');
      // assert.equal(popup.find('.content').text(), 'Add users to your feed');

      done();
    }, 500);
  });

  test("position sets initially, then doesnt after that init", async function (assert) {
    assert.expect(3);

    this.set("content", "something");

    await render(hbs`
      <UiPopup @content={{this.content}} @position="bottom right" >
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    this.$("div").popup("show");

    let done = assert.async();

    setTimeout(() => {
      assert.equal(window.$(".ui.popup").length, 1);
      let popup = window.$(".ui.popup");
      assert.equal(popup.text(), "something");

      this.set("content", "something else");

      assert.equal(popup.text(), "something else");
      done();
    }, 500);
  });

  test("changing class doesnt throw error", async function (assert) {
    assert.expect(5);

    this.set("class", "some style");

    await render(hbs`
      <UiPopup @content="something" class={{this.class}} >
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    this.$("div").popup("show");

    let done = assert.async();

    setTimeout(() => {
      assert.equal(window.$(".ui.popup").length, 1);
      let popup = window.$(".ui.popup");
      assert.equal(popup.text(), "something");

      assert.ok(find("div").getAttribute("class").includes("some style"));

      this.set("class", "other style");

      assert.equal(popup.text(), "something");

      assert.ok(find("div").getAttribute("class").includes("other style"));
      done();
    }, 500);
  });

  test("popup unwraps safe string", async function (assert) {
    assert.expect(2);

    this.set("html", htmlSafe("<b>Awesome</b>"));

    await render(hbs`
      <UiPopup @html={{this.html}} >
        <div class="ui icon button">
          <i class="add icon"></i>
        </div>
      </UiPopup >
    `);

    this.$("div").popup("show");

    let done = assert.async();

    setTimeout(() => {
      assert.equal(window.$(".ui.popup").length, 1);
      let popup = window.$(".ui.popup");
      assert.equal(popup.html(), "<b>Awesome</b>");
      done();
    }, 500);
  });
});
