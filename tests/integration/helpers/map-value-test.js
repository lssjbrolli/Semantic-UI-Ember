import PromiseProxyMixin from "@ember/object/promise-proxy-mixin";
import ObjectProxy from "@ember/object/proxy";
import { later } from "@ember/runloop";
import { defer, all } from "rsvp";
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import afterRender from "dummy/tests/helpers/after-render";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Helper | map value", function(hooks) {
  setupRenderingTest(hooks);

  test("renders value passed in on non-promise", async function(assert) {
    this.set("value", 42);
    this.set("mapper", value => {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value this.mapper this.value}}>{{this.text}}</div>
    `);

    assert.dom(".item").hasAttribute("data-value", "42");
    assert.dom(".item").hasText("Forty Two");
  });

  test("when unresolved renders is passed in, null is rendered", async function(assert) {
    let deferred = defer();

    this.set("value", deferred.promise);
    this.set("mapper", value => {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value this.mapper this.value}}>{{this.text}}</div>
    `);

    assert.dom(".item").hasNoAttribute("data-value");
    assert.dom(".item").hasText("Forty Two");

    deferred.resolve("LIFE");

    return afterRender(deferred.promise).then(() => {
      assert
        .dom(".item")
        .hasAttribute(
          "data-value",
          "LIFE",
          "data value is updated to correct value"
        );
    });
  });

  test("when unresolved renders is passed in, null is rendered", async function(assert) {
    let deferred1 = defer();
    let deferred2 = defer();
    let deferred3 = defer();

    this.set("value", deferred3.promise);
    this.set("mapper", function(value) {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.dom(".item").hasNoAttribute("data-value");
    assert.dom(".item").hasText("Forty Two");

    deferred1.resolve("number 1");

    later(deferred2, "resolve", "number 2", 200);
    later(deferred3, "resolve", "number 3", 500);

    this.set("value", deferred2.promise);
    this.set("value", deferred3.promise);

    return afterRender(all([deferred2.promise, deferred3.promise])).then(() => {
      assert
        .dom(".item")
        .hasAttribute(
          "data-value",
          "number 3",
          "data value is updated to correct value"
        );
    });
  });

  test("renders null until the promise is rejected", async function(assert) {
    let deferred = defer();

    this.set("value", deferred.promise);

    this.set("mapper", value => {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value this.mapper this.value}}>{{this.text}}</div>
    `);

    deferred.reject(new Error("oops"));

    return afterRender(deferred.promise).then(async () => {
      assert
        .dom(".item")
        .hasNoAttribute(
          "data-value",
          "value of re-render does not reveal reason for rejection"
        );
    });
  });

  // TODO fix test (dataset is undefined after promise)
  // test("changing the promise changes the eventually rendered value", async function(assert) {
  //   let deferred1 = defer();
  //   let deferred2 = defer();

  //   this.set("value", deferred1.promise);
  //   this.set("mapper", function(value) {
  //     return value;
  //   });
  //   this.set("text", "Forty Two");

  //   await render(hbs`
  //     <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
  //   `);

  //   const deferred1Text = "hi";
  //   const deferred2Text = "bye";

  //   deferred1.resolve(deferred1Text);

  //   return afterRender(deferred1.promise)
  //     .then(() => {
  //       deferred2.resolve(deferred2Text);
  //       this.set("value", deferred2.promise);
  //       return afterRender(deferred2.promise);
  //     })
  //     .then(() => {
  //       assert
  //         .dom(".item")
  //         .hasAttribute(
  //           "data-value",
  //           deferred2Text,
  //           "value updates when the promise changes"
  //         );
  //     });
  // });

  test("switching from promise to non-promise correctly ignores promise resolution", async function(assert) {
    let deferred = defer();

    this.set("value", deferred.promise);
    this.set("mapper", function(value) {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    this.set("value", "iAmConstant");
    assert.dom(".item").hasAttribute("data-value", "iAmConstant");
    deferred.resolve("promiseFinished");

    return afterRender(deferred.promise).then(() => {
      assert
        .dom(".item")
        .hasAttribute(
          "data-value",
          "iAmConstant",
          "ignores a promise that has been replaced"
        );
    });
  });

  test("promises that get wrapped by RSVP.Promise.resolve still work correctly", async function(assert) {
    let deferred = defer();
    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferred.promise
    });

    this.set("value", proxy);
    this.set("mapper", function(value) {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);
    deferred.resolve("hasAValue");
    return afterRender(deferred.promise).then(() => {
      assert.dom(".item").hasAttribute("data-value", "hasAValue");
    });
  });

  test("renders previously fullfilled promise right away", async function(assert) {
    const text = "yass!";

    let deferred = defer();
    deferred.resolve(text);

    this.set("value", deferred.promise);
    this.set("mapper", function(value) {
      return value;
    });
    this.set("text", "Forty Two");

    await render(hbs`
      <div class="item" data-value={{map-value mapper value}}>{{text}}</div>
    `);

    assert.dom(".item").exists({ count: 1 });
    assert.dom(".item").hasAttribute("data-value", text);

    return afterRender(deferred.promise).then(() => {
      assert
        .dom(".item")
        .hasAttribute(
          "data-value",
          text,
          "re-renders when the promise is resolved"
        );
    });
  });
});
