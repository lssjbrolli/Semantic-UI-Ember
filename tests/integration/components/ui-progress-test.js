import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui progress', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders with percent', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#ui-progress percent=40 class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 40);
  });

  test('it renders with value', async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#ui-progress value=40 class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 40);
  });

  test('binding updates precent progress', async function(assert) {
    assert.expect(4);

    this.set('progress', 40);
    await render(hbs`
      {{#ui-progress percent=progress class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 40);
    var width = this.$('.ui.progress .bar').css('width');
    this.set('progress', 60);

    let done = assert.async();

    setTimeout(() => {
      assert.equal(this.$('.ui.progress').attr('data-percent'), 60);
      assert.notEqual(this.$('.ui.progress .bar').css('width'), width);

      done();
    }, 500);
  });

  test('binding updates precent progress with total', async function(assert) {
    assert.expect(4);

    this.set('progress', 40);
    await render(hbs`
      {{#ui-progress percent=progress total=30 class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 40);
    var width = this.$('.ui.progress .bar').css('width');
    this.set('progress', 60);

    let done = assert.async();

    setTimeout(() => {
      assert.equal(this.$('.ui.progress').attr('data-percent'), 60);
      assert.notEqual(this.$('.ui.progress .bar').css('width'), width);

      done();
    }, 500);
  });

  test('binding updates progress', async function(assert) {
    assert.expect(4);

    this.set('value', 50);
    await render(hbs`
      {{#ui-progress value=value progress=value class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 50);
    var width = this.$('.ui.progress .bar').css('width');
    this.set('value', 70);

    let done = assert.async();

    setTimeout(() => {
      assert.equal(this.$('.ui.progress').attr('data-percent'), 70);
      assert.notEqual(this.$('.ui.progress .bar').css('width'), width);

      done();
    }, 500);
  });

  test('binding updates progress with total', async function(assert) {
    assert.expect(4);

    this.set('value', 15);
    await render(hbs`
      {{#ui-progress value=value progress=value total=30 class="teal indicating"}}
        <div class="bar"></div>
        <div class="label">Completed</div>
      {{/ui-progress}}
    `);

    assert.equal(this.$('.ui.progress').length, 1);
    assert.equal(this.$('.ui.progress').attr('data-percent'), 50);
    var width = this.$('.ui.progress .bar').css('width');
    this.set('value', 21);

    let done = assert.async();

    setTimeout(() => {
      assert.equal(this.$('.ui.progress').attr('data-percent'), 70);
      assert.notEqual(this.$('.ui.progress .bar').css('width'), width);

      done();
    }, 500);
  });
});
