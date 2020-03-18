import { defer, all } from "rsvp";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, findAll, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import afterRender from "dummy/tests/helpers/after-render";

module("Integration | Component | ui radio", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);

    await render(hbs`<UiRadio
    @name="fruit"
    @label="Once a week"
    @value="once-a-week"
  />`);

    console.log(findAll(".ui.radio"));

    assert.equal(findAll(".ui.radio").length, 3);
  });

  // test("will start with selected current property", async function(assert) {
  //   assert.expect(3);

  //   let count = 0;
  //   this.changed = () => {
  //     count++;
  //   };

  //   this.frequency = "weekly";
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           <UiRadio @name="frequency" @label="Once a week" @value='weekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
  //         </div>
  //         <div class="field">
  //           <UiRadio @name="frequency" @label="2-3 times a week" @value='biweekly' @current={{this.frequency}} @onChange={{fn this.changed}} />
  //         </div>
  //         <div class="field">
  //           <UiRadio @name="frequency" @label="Once a day" @value='daily' @current={{this.frequency}} @onChange={{fn this.changed}} />
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));
  //   assert.equal(count, 0, "onChange shouldnt have been called");
  // });

  // test("selecting will update the bound property", async function(assert) {
  //   assert.expect(3);

  //   let count = 0;
  //   this.set("changed", value => {
  //     this.set("frequency", value);
  //     count++;
  //   });

  //   this.set("frequency", "weekly");
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   await click(findAll(".ui.radio")[2]);
  //   assert.equal("daily", this.frequency);
  //   assert.equal(count, 1, "onChange should have been called only once");
  // });

  // test("selecting twice will update the bound property to the latest", async function(assert) {
  //   assert.expect(8);

  //   let count = 0;
  //   this.set("changed", value => {
  //     this.set("frequency", value);
  //     count++;
  //   });

  //   this.set("frequency", "weekly");
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   await click(findAll(".ui.radio")[2]);
  //   assert.equal("daily", this.frequency);
  //   assert.ok(findAll(".ui.radio")[2].classList.contains("checked"));

  //   await click(findAll(".ui.radio")[0]);
  //   assert.equal("weekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));

  //   await click(findAll(".ui.radio")[1]);
  //   assert.equal("biweekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //   assert.equal(count, 3, "onChange should have been called three times");
  // });

  // test("setting disabled ignores click", async function(assert) {
  //   assert.expect(6);

  //   let count = 0;
  //   this.set("changed", value => {
  //     this.set("frequency", value);
  //     count++;
  //   });

  //   this.set("checked", false);
  //   this.set("disabled", true);
  //   this.set("frequency", "weekly");
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency disabled=disabled onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   await click(findAll(".ui.radio")[1]);

  //   assert.equal("weekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));

  //   this.set("disabled", false);

  //   await click(findAll(".ui.radio")[1]);
  //   assert.equal("biweekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //   assert.equal(count, 1, "onChange should have been called only once");
  // });

  // test("setting readonly ignores click", async function(assert) {
  //   assert.expect(6);

  //   let count = 0;
  //   this.set("changed", value => {
  //     this.set("frequency", value);
  //     count++;
  //   });

  //   this.set("checked", false);
  //   this.set("readonly", true);
  //   this.set("frequency", "weekly");
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency readonly=readonly onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   await click(findAll(".ui.radio")[1]);

  //   assert.equal("weekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));

  //   this.set("readonly", false);

  //   await click(findAll(".ui.radio")[1]);
  //   assert.equal("biweekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //   assert.equal(count, 1, "onChange should have been called only once");
  // });

  // test("setting binded value updates to current", async function(assert) {
  //   assert.expect(7);

  //   let count = 0;
  //   this.set("changed", value => {
  //     this.set("frequency", value);
  //     count++;
  //   });

  //   this.set("checked", false);
  //   this.set("disabled", true);
  //   this.set("frequency", "weekly");
  //   this.set("value1", "weekly1");
  //   this.set("value2", "biweekly");
  //   this.set("value3", "daily");
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value=value1 current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value=value3 current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.equal(findAll(".ui.radio.checked").length, 0);

  //   assert.equal("weekly", this.frequency);
  //   this.set("value1", "weekly");
  //   assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));

  //   this.set("frequency", "biweekly");
  //   assert.equal("biweekly", this.frequency);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //   assert.equal(count, 0, "onChange should not have been called");
  // });

  // test("will selected when current promise resolves", async function(assert) {
  //   assert.expect(5);

  //   let count = 0;
  //   this.set("changed", () => {
  //     count++;
  //   });

  //   let deferred = defer();

  //   this.set("frequency", deferred.promise);
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.equal(findAll(".ui.radio.checked").length, 0);

  //   deferred.resolve("weekly");

  //   return afterRender(deferred.promise).then(() => {
  //     assert.equal(findAll(".ui.radio.checked").length, 1);
  //     assert.ok(findAll(".ui.radio")[0].classList.contains("checked"));
  //     assert.equal(count, 0, "onChange should not have been called");
  //   });
  // });

  // test("will selected when value promise resolves", async function(assert) {
  //   assert.expect(5);

  //   let count = 0;
  //   this.set("changed", () => {
  //     count++;
  //   });

  //   let deferred = defer();

  //   this.set("frequency", "biweekly");
  //   this.set("value2", deferred.promise);
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.equal(findAll(".ui.radio.checked").length, 0);

  //   deferred.resolve("biweekly");

  //   return afterRender(deferred.promise).then(() => {
  //     assert.equal(findAll(".ui.radio.checked").length, 1);
  //     assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //     assert.equal(count, 0, "onChange should not have been called");
  //   });
  // });

  // test("will selected when value promise resolves", async function(assert) {
  //   assert.expect(5);

  //   let count = 0;
  //   this.set("changed", () => {
  //     count++;
  //   });

  //   let deferredCurrent = defer();
  //   let deferredValue = defer();

  //   this.set("frequency", deferredCurrent.promise);
  //   this.set("value3", deferredValue.promise);
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.equal(findAll(".ui.radio.checked").length, 0);

  //   deferredCurrent.resolve("daily");
  //   deferredValue.resolve("daily");

  //   return afterRender(
  //     all([deferredCurrent.promise, deferredValue.promise])
  //   ).then(() => {
  //     assert.equal(findAll(".ui.radio.checked").length, 1);
  //     assert.ok(findAll(".ui.radio")[2].classList.contains("checked"));
  //     assert.equal(count, 0, "onChange should not have been called");
  //   });
  // });

  // test("will update properly if a static value is replaced for a promise on value", async function(assert) {
  //   assert.expect(7);

  //   let count = 0;
  //   this.set("changed", () => {
  //     count++;
  //   });

  //   let value2 = "biweekly";

  //   this.set("frequency", "biweekly");
  //   this.set("value2", value2);
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value=value2 current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));

  //   let deferred = defer();

  //   this.set("value2", deferred.promise);

  //   // No changes should take place until the promise resolves
  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));

  //   deferred.resolve("bi-weekly");

  //   return afterRender(deferred.promise).then(() => {
  //     assert.equal(findAll(".ui.radio").length, 3);
  //     assert.equal(findAll(".ui.radio.checked").length, 0);
  //     assert.equal(count, 0, "onChange should not have been called");
  //   });
  // });

  // test("will update properly if a static value is replaced for a promise on current", async function(assert) {
  //   assert.expect(8);

  //   let count = 0;
  //   this.set("changed", () => {
  //     count++;
  //   });

  //   let current = "biweekly";

  //   this.set("frequency", current);
  //   await render(hbs`
  //     <div class="ui form">
  //       <div class="grouped inline fields">
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a week" value='weekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="2-3 times a week" value='biweekly' current=frequency onChange=(action changed)}}
  //         </div>
  //         <div class="field">
  //           {{ui-radio name="frequency" label="Once a day" value='daily' current=frequency onChange=(action changed)}}
  //         </div>
  //       </div>
  //     </div>
  //   `);

  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));

  //   let deferred = defer();

  //   this.set("current", deferred.promise);

  //   // No changes should take place until the promise resolves
  //   assert.equal(findAll(".ui.radio").length, 3);
  //   assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));

  //   deferred.resolve("biweekly");

  //   return afterRender(deferred.promise).then(() => {
  //     assert.equal(findAll(".ui.radio").length, 3);
  //     assert.equal(findAll(".ui.radio.checked").length, 1);
  //     assert.ok(findAll(".ui.radio")[1].classList.contains("checked"));
  //     assert.equal(count, 0, "onChange should not have been called");
  //   });
  // });
});
