import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui shape', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#ui-shape}}
        <p>Content</p>
      {{/ui-shape}}
    `);

    assert.equal(this.$('.ui.shape').length, 1);
  });
});
