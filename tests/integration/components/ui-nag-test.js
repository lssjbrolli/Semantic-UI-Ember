import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | ui nag', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{#ui-nag class="inline cookie"}}
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      {{/ui-nag}}
    `);

    assert.equal(this.$('.ui.nag').length, 1);
  });

  test('it will only show once', async function(assert) {
    assert.expect(4);

    await render(hbs`
      {{#ui-nag class="inline cookie"}}
        <span class="title">
          We use cookies to ensure you get the best experience on our website
        </span>
        <i class="close icon"></i>
      {{/ui-nag}}
    `);

    assert.equal(this.$('.ui.nag').length, 1);
    this.$('.ui.nag').nag('clear');
    this.$('.ui.nag').nag('show');
    assert.equal(this.$('.ui.nag').css('display'), 'block');
    this.$('.ui.nag .close').click();

    let done = assert.async();

    setTimeout(() => {
      assert.equal(this.$('.ui.nag').css('display'), 'none');
      this.$('.ui.nag').nag('show');
      assert.equal(this.$('.ui.nag').css('display'), 'block');

      done();
    }, 1000);
  });
});
