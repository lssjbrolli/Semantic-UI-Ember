import { defer, all } from "rsvp";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, findAll, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import afterRender from "dummy/tests/helpers/after-render";

module("Integration | Component | ui radio", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio
              @name="fruit"
              @label="Once a week"
            />
          </div>
          <div class="field">
            <UiRadio
              @name="fruit"
              @label="2-3 times a week"
            />
          </div>
          <div class="field">
            <UiRadio
              @name="fruit"
              @label="Once a day"
            />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
  });

  test("will start with selected current property", async function (assert) {
    assert.expect(3);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    this.frequency = "weekly";
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    // await this.pauseTest();

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(findAll(".ui.radio")[0]).hasClass("checked");
    assert.equal(count, 0, "onChange shouldnt have been called");
  });

  test("selecting will update the bound property", async function (assert) {
    // assert.expect(3);

    let count = 0;
    this.set("changed", (value) => {
      this.set("frequency", value);
      count++;
    });

    this.set("frequency", "weekly");
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    await click(findAll(".ui.radio")[2]);
    assert.equal(this.frequency, "daily");
    assert.equal(count, 1, "onChange should have been called only once");
  });

  test("selecting twice will update the bound property to the latest", async function (assert) {
    assert.expect(8);

    let count = 0;
    this.set("changed", (value) => {
      this.set("frequency", value);
      count++;
    });

    this.set("frequency", "weekly");
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    await click(findAll(".ui.radio")[2]);
    assert.equal("daily", this.frequency);
    assert.dom(findAll(".ui.radio")[2]).hasClass("checked");

    await click(findAll(".ui.radio")[0]);
    assert.equal("weekly", this.frequency);
    assert.dom(findAll(".ui.radio")[0]).hasClass("checked");

    await click(findAll(".ui.radio")[1]);
    assert.equal("biweekly", this.frequency);
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
    assert.equal(count, 3, "onChange should have been called three times");
  });

  test("setting disabled ignores click", async function (assert) {
    assert.expect(6);

    let count = 0;
    this.set("changed", (value) => {
      this.set("frequency", value);
      count++;
    });

    this.set("checked", false);
    this.set("disabled", true);
    this.set("frequency", "weekly");
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} @disabled={{this.disabled}}/>
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });

    await click(findAll(".ui.radio")[1]);
    assert.equal(this.frequency, "weekly");
    assert.dom(findAll(".ui.radio")[0]).hasClass("checked");

    this.set("disabled", false);

    await click(findAll(".ui.radio")[1]);
    assert.equal("biweekly", this.frequency);
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
    assert.equal(count, 1, "onChange should have been called only once");
  });

  test("setting readonly ignores click", async function (assert) {
    assert.expect(6);

    let count = 0;
    this.set("changed", (value) => {
      this.set("frequency", value);
      count++;
    });

    this.set("checked", false);
    this.set("readonly", true);
    this.set("frequency", "weekly");
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @readonly={{this.readonly}}  @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    await click(findAll(".ui.radio")[1]);

    assert.equal("weekly", this.frequency);
    assert.dom(findAll(".ui.radio")[0]).hasClass("checked");

    this.set("readonly", false);

    await click(findAll(".ui.radio")[1]);
    assert.equal("biweekly", this.frequency);
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
    assert.equal(count, 1, "onChange should have been called only once");
  });

  test("setting binded value updates to current", async function (assert) {
    assert.expect(7);

    let count = 0;
    this.set("changed", (value) => {
      this.set("frequency", value);
      count++;
    });

    this.set("checked", false);
    this.set("disabled", true);
    this.set("frequency", "weekly");
    this.set("value1", "weekly1");
    this.set("value2", "biweekly");
    this.set("value3", "daily");
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value={{this.value1}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value={{this.value2}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value={{this.value3}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(".ui.radio.checked").doesNotExist();

    assert.equal("weekly", this.frequency);
    this.set("value1", "weekly");
    assert.dom(findAll(".ui.radio")[0]).hasClass("checked");

    this.set("frequency", "biweekly");
    assert.equal("biweekly", this.frequency);
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
    assert.equal(count, 0, "onChange should not have been called");
  });

  test("will selected when current promise resolves", async function (assert) {
    assert.expect(5);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    let deferred = defer();

    this.set("frequency", deferred.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(".ui.radio.checked").doesNotExist();

    deferred.resolve("weekly");

    return afterRender(deferred.promise).then(() => {
      assert.dom(".ui.radio.checked").exists({ count: 1 });
      assert.dom(findAll(".ui.radio")[0]).hasClass("checked");
      assert.equal(count, 0, "onChange should not have been called");
    });
  });

  test("will selected when value promise resolves", async function (assert) {
    assert.expect(5);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    let deferred = defer();

    this.set("frequency", "biweekly");
    this.set("value2", deferred.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value={{this.value2}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(".ui.radio.checked").doesNotExist();

    deferred.resolve("biweekly");

    return afterRender(deferred.promise).then(() => {
      assert.dom(".ui.radio.checked").exists({ count: 1 });
      assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
      assert.equal(count, 0, "onChange should not have been called");
    });
  });

  test("will selected when value promise resolves", async function (assert) {
    assert.expect(5);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    let deferredCurrent = defer();
    let deferredValue = defer();

    this.set("frequency", deferredCurrent.promise);
    this.set("value3", deferredValue.promise);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value={{this.value2}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(".ui.radio.checked").doesNotExist();

    deferredCurrent.resolve("daily");
    deferredValue.resolve("daily");

    return afterRender(
      all([deferredCurrent.promise, deferredValue.promise])
    ).then(() => {
      assert.dom(".ui.radio.checked").exists({ count: 1 });
      assert.dom(findAll(".ui.radio")[2]).hasClass("checked");
      assert.equal(count, 0, "onChange should not have been called");
    });
  });

  test("will update properly if a static value is replaced for a promise on value", async function (assert) {
    assert.expect(7);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    let value2 = "biweekly";

    this.set("frequency", "biweekly");
    this.set("value2", value2);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value={{this.value2}} @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");

    let deferred = defer();

    this.set("value2", deferred.promise);

    // No changes should take place until the promise resolves
    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");

    deferred.resolve("bi-weekly");

    return afterRender(deferred.promise).then(() => {
      assert.dom(".ui.radio").exists({ count: 3 });
      assert.dom(".ui.radio.checked").doesNotExist();
      assert.equal(count, 0, "onChange should not have been called");
    });
  });

  test("will update properly if a static value is replaced for a promise on current", async function (assert) {
    assert.expect(8);

    let count = 0;
    this.set("changed", () => {
      count++;
    });

    let current = "biweekly";

    this.set("frequency", current);
    await render(hbs`
      <div class="ui form">
        <div class="grouped inline fields">
          <div class="field">
            <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
          <div class="field">
            <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
          </div>
        </div>
      </div>
    `);

    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");

    let deferred = defer();

    this.set("current", deferred.promise);

    // No changes should take place until the promise resolves
    assert.dom(".ui.radio").exists({ count: 3 });
    assert.dom(findAll(".ui.radio")[1]).hasClass("checked");

    deferred.resolve("biweekly");

    return afterRender(deferred.promise).then(() => {
      assert.dom(".ui.radio").exists({ count: 3 });
      assert.dom(".ui.radio.checked").exists({ count: 1 });
      assert.dom(findAll(".ui.radio")[1]).hasClass("checked");
      assert.equal(count, 0, "onChange should not have been called");
    });
  });
});
