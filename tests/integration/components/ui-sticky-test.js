import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui sticky', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{#ui-sticky}}
        <p>Some text</p>
      {{/ui-sticky}}
    `);

    assert.equal(this.$('.ui.sticky').length, 1);
    assert.ok(this.$('.ui.sticky').css('width') !== undefined);
    assert.ok(this.$('.ui.sticky').css('height') !== undefined);
  });
});
