import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui checkbox', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(2);

    let count = 0;
    this.set('changed', () => {
      count++;
    });

    this.set('checked', false);
    await render(hbs`
      {{ui-checkbox label="Make my profile visible" checked=checked onChange=(action changed)}}
    `);

    assert.equal(this.$('.ui.checkbox').length, 1);
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('checking will update the bound property', async function(assert) {
    assert.expect(3);

    let count = 0;
    this.set('changed', (value) => {
      this.set('checked', value);
      count++;
    });

    this.set('checked', false);
    await render(hbs`
      {{ui-checkbox label="Make my profile visible" checked=checked onChange=(action changed)}}
    `);

    assert.equal(this.$('.ui.checkbox').length, 1);
    this.$('.ui.checkbox').click();
    assert.equal(true, this.get('checked'));
    assert.equal(count, 1, 'onChange should have only been called once');
  });

  test('setting disabled ignores click', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('checked', value);
      count++;
    });

    this.set('checked', false);
    this.set('disabled', true);
    await render(hbs`
      {{ui-checkbox label="Make my profile visible" checked=checked disabled=disabled onChange=(action changed)}}
    `);

    assert.equal(this.$('.ui.checkbox').length, 1);
    this.$('.ui.checkbox').click();
    assert.equal(false, this.get('checked'));

    this.set('disabled', false);
    this.$('.ui.checkbox').click();
    assert.equal(true, this.get('checked'));
    assert.equal(count, 1, 'onChange should have only been called once');
  });

  test('setting readonly ignores click', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('checked', value);
      count++;
    });

    this.set('checked', false);
    this.set('readonly', true);
    await render(hbs`
      {{ui-checkbox label="Make my profile visible" checked=checked readonly=readonly onChange=(action changed)}}
    `);

    assert.equal(this.$('.ui.checkbox').length, 1);
    this.$('.ui.checkbox').click();
    assert.equal(false, this.get('checked'));

    this.set('readonly', false);
    this.$('.ui.checkbox').click();
    assert.equal(true, this.get('checked'));
    assert.equal(count, 1, 'onChange should have only been called once');
  });
});