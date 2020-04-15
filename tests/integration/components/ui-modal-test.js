/* eslint-disable ember/no-jquery */
import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { bind } from "@ember/runloop";
import $ from "jquery";

module("Integration | Component | ui modal", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`
      <UiModal />
    `);

    assert.dom(".ui.modal").exists({ count: 1 });
  });

  test("it will show if triggered", async function (assert) {
    assert.expect(3);

    let done = assert.async();

    this.set("openModal", () => {
      $(".ui.modal").modal(
        "show",
        bind(() => {
          assert
            .dom(".ui.modal.visible")
            .exists({ count: 1 }, "UI Modal is visible after showing");
          done();
        })
      );
    });

    await render(hbs`
      <div class="ui button" {{on 'click' (fn this.openModal)}}>
        Open
      </div>

      <UiModal @name='profile'/>
    `);

    assert.dom(".ui.modal").exists({ count: 1 }, "UI Modal exists");
    assert.dom(".ui.modal.visible").doesNotExist("UI Modal is not visible");

    await click(".ui.button");
  });

  test("it will send approve back to controller and hide", async function (assert) {
    assert.expect(3);

    let done = assert.async();

    this.set("openModal", () => {
      $(".ui.modal").modal(
        "show",
        bind(async () => {
          assert
            .dom(".ui.modal.visible")
            .exists({ count: 1 }, ".ui.modal is visible after showing");
          await click(".ui.modal .ui.positive.button");
        })
      );
    });

    this.set("approve", (element, component) => {
      let name = component.args.name;
      assert.equal("profile", name, "approve is called");
      setTimeout(() => {
        assert
          .dom(".ui.modal.visible")
          .doesNotExist(".ui.modal is not visible after clicking");
        done();
      }, 1000);
      return true;
    });

    await render(hbs`
      <div class="ui open button" {{on 'click' (fn this.openModal 'profile')}}>
        Open
      </div>

      <UiModal @name='profile' @onApprove={{fn this.approve}} >
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      </UiModal>
    `);

    await click(".ui.open.button");
  });

  test("it will send approve back to controller and skip the hide", async function (assert) {
    assert.expect(3);

    let done = assert.async();

    this.set("openModal", () => {
      $(".ui.modal").modal(
        "show",
        bind(async () => {
          assert
            .dom(".ui.modal.visible")
            .exists({ count: 1 }, ".ui.modal is visible after showing");
          await click(".ui.modal .ui.positive.button");
        })
      );
    });

    this.set("approve", (element, component) => {
      let name = component.args.name;
      assert.equal("profile", name, "approve is called");
      setTimeout(() => {
        assert
          .dom(".ui.modal.visible")
          .exists({ count: 1 }, ".ui.modal is visible after clicking");
        done();
      }, 1000);
      return false;
    });

    await render(hbs`
      <div class="ui open button" {{on 'click' (fn this.openModal 'profile')}}>
        Open
      </div>

      <UiModal @name='profile' @onApprove={{fn this.approve}} >
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      </UiModal>
    `);

    await click(".ui.open.button");
  });

  test("it will send deny back to controller", async function (assert) {
    assert.expect(1);

    let done = assert.async();

    this.set("openModal", () => {
      $(".ui.modal").modal("show", async () => {
        await click(".ui.negative.button");
      });
    });

    this.set("deny", (element, component) => {
      var name = component.args.name;
      assert.equal("profile", name);
      done();
    });

    await render(hbs`
      <div class="ui button" {{on 'click' (fn this.openModal 'profile')}}>
        Open
      </div>

      <UiModal @name='profile' @onDeny={{fn this.deny}} >
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      </UiModal>
    `);

    await click(".ui.button");
  });
});
