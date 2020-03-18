import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, findAll } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import $ from "jquery";

module("Integration | Component | ui modal", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test("it renders", async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{ui-modal name='profile'}}
    `);

    assert.equal(findAll(".ui.modal").length, 1);
  });

  test("it will show if triggered", async function(assert) {
    assert.expect(3);

    let done = assert.async();

    this.actions.openModal = () => {
      $(".ui.modal").modal("show", () => {
        assert.equal(
          findAll(".ui.modal.visible").length,
          1,
          ".ui.modal is visible after showing"
        );
        done();
      });
    };

    await render(hbs`
      <div class="ui button" {{action 'openModal' 'profile'}}>
        Open
      </div>

      {{ui-modal name='profile'}}
    `);

    assert.equal(findAll(".ui.modal").length, 1, ".ui.modal exists");
    assert.equal(
      findAll(".ui.modal.visible").length,
      0,
      ".ui.modal is not visible"
    );

    await click(".ui.button");
  });

  test("it will send approve back to controller and hide", async function(assert) {
    assert.expect(3);

    let done = assert.async();

    this.actions.openModal = () => {
      $(".ui.modal").modal("show", async () => {
        assert.equal(
          findAll(".ui.modal.visible").length,
          1,
          ".ui.modal is visible after showing"
        );
        await click(".ui.modal .ui.positive.button");
      });
    };

    this.actions.approve = function(element, component) {
      var name = component.get("name");
      assert.equal("profile", name, "approve is called");
      setTimeout(() => {
        assert.equal(
          findAll(".ui.modal.visible").length,
          0,
          ".ui.modal is not visible after clicking"
        );
        done();
      }, 1000);
      return true;
    };

    await render(hbs`
      <div class="ui open button" {{action 'openModal' 'profile'}}>
        Open
      </div>

      {{#ui-modal name='profile' onApprove=(action 'approve')}}
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      {{/ui-modal}}
    `);

    await click(".ui.open.button");
  });

  test("it will send approve back to controller and skip the hide", async function(assert) {
    assert.expect(3);

    let done = assert.async();

    this.actions.openModal = () => {
      $(".ui.modal").modal("show", async () => {
        assert.equal(
          findAll(".ui.modal.visible").length,
          1,
          ".ui.modal is visible after showing"
        );
        await click(".ui.modal .ui.positive.button");
      });
    };

    this.actions.approve = function(element, component) {
      var name = component.get("name");
      assert.equal("profile", name, "approve is called");
      setTimeout(() => {
        assert.equal(
          findAll(".ui.modal.visible").length,
          1,
          ".ui.modal is visible after clicking"
        );
        done();
      }, 1000);
      return false;
    };

    await render(hbs`
      <div class="ui open button" {{action 'openModal' 'profile'}}>
        Open
      </div>

      {{#ui-modal name='profile' onApprove=(action 'approve')}}
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      {{/ui-modal}}
    `);

    await click(".ui.open.button");
  });

  test("it will send deny back to controller", async function(assert) {
    assert.expect(1);

    let done = assert.async();

    this.actions.openModal = () => {
      $(".ui.modal").modal("show", async () => {
        await click(".ui.negative.button");
      });
    };

    this.actions.deny = function(element, component) {
      var name = component.get("name");
      assert.equal("profile", name);
      done();
    };

    await render(hbs`
      <div class="ui button" {{action 'openModal' 'profile'}}>
        Open
      </div>

      {{#ui-modal name='profile' onDeny=(action 'deny')}}
        <div class="actions">
          <div class="ui negative button">No</div>
          <div class="ui positive button">Yes</div>
        </div>
      {{/ui-modal}}
    `);

    await click(".ui.button");
  });
});
