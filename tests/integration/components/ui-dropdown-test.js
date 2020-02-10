import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import ObjectProxy from '@ember/object/proxy';
import { defer } from 'rsvp';
import { begin, end } from '@ember/runloop';
import EmberObject from '@ember/object';
import { A } from '@ember/array';
import $ from 'jquery';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import afterRender from 'dummy/tests/helpers/after-render';

module('Integration | Component | ui dropdown', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders from an array', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', [ "Sherlock Homes", "Patrick Bateman" ]);
    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person}}>{{person}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.get('selected'), undefined);

    this.$(".menu .item[data-value='Sherlock Homes']").click();
    assert.equal(this.get('selected'), 'Sherlock Homes');
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders from an object array', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.get('selected'), undefined);

    this.$(".menu .item[data-value=1]").click();
    assert.equal(this.get('selected'), 1);
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders with an option selected', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    this.set('selected', 2);
    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.get('selected'), 2);

    this.$(".menu .item[data-value=1]").click();
    assert.equal(this.get('selected'), 1);
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders multiple', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    await render(hbs`
      {{#ui-dropdown class='multiple' selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.get('selected'), undefined);

    this.$(".menu .item[data-value=1]").click();
    this.$(".menu .item[data-value=2]").click();
    assert.equal(this.get('selected'), '1,2');
    assert.equal(count, 2, 'onChange should have been called only once');
  });

  test('it sets the value from the binding', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people_id', 2);
    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    await render(hbs`
      {{#ui-dropdown selected=people_id onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class="item" data-value="{{person.id}}">
            {{person.name}}
          </div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.$('.item.selected').length, 1);
    assert.equal(this.$('.item.selected').data('value'), 2);
    assert.equal(count, 0, 'onChange should have not been called');
  });

  test('it updates the value if updated from the binding', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people_id', 2);
    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    await render(hbs`
      {{#ui-dropdown selected=people_id onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class="item" data-value="{{person.id}}">
            {{person.name}}
          </div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);

    this.set('people_id', 1);
    assert.equal(this.$('.item.selected').data('value'), 1);

    $(this.$('.item')[0]).click();
    assert.equal(this.get('people_id'), 1);
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it can set the selected value without binding for full DDAU', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('people_id', value);
      count++;
    });

    this.set('people_id', 2);
    this.set('people', [
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]);

    await render(hbs`
      {{#ui-dropdown onChange=(action changed)}}
        <input type="hidden" name="person" value="{{people_id}}" />
        <div class='menu'>
        {{#each people as |person|}}
          <div class="item" data-value="{{person.id}}">
            {{person.name}}
          </div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.$('.item.selected').length, 0);

    $(this.$('.item')[0]).click();
    assert.equal(this.$('.item.selected').data('value'), 1);
    assert.equal(this.get('people_id'), 1);
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders and clears the value if it changes and isnt found', async function(assert) {
    assert.expect(11);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected.id', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected.id onChange=(action changed)}}
        <i class="dropdown icon"></i>
        <div class="default text"></div>
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");
    assert.equal(this.$('.ui.dropdown > .text').text(), '', "Default text isn't blank");

    this.set('selected', this.get('people').objectAt(1));
    assert.equal(this.$('.item.active').text(), "Patrick Bateman");
    assert.equal(this.$('.ui.dropdown > .text').text(), 'Patrick Bateman', "Default text isn't correct");

    this.$(".menu .item[data-value=1]").click();
    assert.equal(this.get('selected.id'), "1", "Sherlock has been selected");

    // Now clear the property
    this.set('selected', null);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0);
    assert.equal(this.$('.ui.dropdown > .text').text(), '', "Default text isn't blank");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });


  ///
  // Object mapping
  ///
  test('it renders from a mapper', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected.id'), "1", "Sherlock has been selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });


  test('it renders from a mapper and preselects the right value', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    this.set('selected', this.get('people').objectAt(1));

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected.id'), "2", "Patrick has been selected");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected.id'), "1", "Sherlock has been selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders from a mapper and selects the right value if late', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");

    this.set('selected', this.get('people').objectAt(1));
    assert.equal(this.$('.item.active').text(), "Patrick Bateman");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected.id'), "1", "Sherlock has been selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders from a mapper and clears the value if it changes and isnt found', async function(assert) {
    assert.expect(11);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <i class="dropdown icon"></i>
        <div class="default text"></div>
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");
    assert.equal(this.$('.ui.dropdown > .text').text(), '', "Default text isn't blank");

    this.set('selected', this.get('people').objectAt(1));
    assert.equal(this.$('.item.active').text(), "Patrick Bateman");
    assert.equal(this.$('.ui.dropdown > .text').text(), 'Patrick Bateman', "Default text isn't correct");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected.id'), "1", "Sherlock has been selected");

    // Now clear the property
    this.set('selected', null);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0);
    assert.equal(this.$('.ui.dropdown > .text').text(), '', "Default text isn't blank");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders from a mapper and clears the value if it changes and isnt found on sub property', async function(assert) {
    assert.expect(8);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected.sub', value);
      count++;
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      { id: 2, name: "Patrick Bateman" }
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected.sub onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    let selected = EmberObject.create({ sub: this.get('people').objectAt(1) });

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected.sub'), undefined, "Nothing is selected");

    this.set('selected', selected);
    assert.equal(this.$('.item.active').text(), "Patrick Bateman");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected.sub.id'), "1", "Sherlock has been selected");

    // Now clear the property
    this.set('selected.sub', null);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0);
    assert.equal(this.get('selected.sub'), undefined, "Nothing is selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('it renders from a mapper and binds to value', async function(assert) {
    assert.expect(8);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('numbers', A([
      1,
      2
    ]));

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{map-value mapper number}} data-id={{number}}>{{number}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.get('selected'), undefined, "Nothing is selected");

    this.set('selected', 2);
    assert.equal(this.$('.item.active').text(), "2");

    this.$(".menu .item[data-id=1]").click();
    assert.equal(this.get('selected'), 1, "Sherlock has been selected");

    // Now clear the property
    this.set('selected', null);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0);
    assert.equal(this.get('selected'), null, "Nothing is selected");
    assert.equal(count, 1, 'onChange should have been called only once');
  });

  test('The correct number of items are pre selected on selected array', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('numbers', A([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]));

    this.set('selected', ['2', '4']);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{number}} data-id={{number}}>{{number}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 2, "Pre selected count");
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('The correct number of items are pre selected on selected item', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('numbers', A([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]));

    this.set('selected', '2');

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{number}} data-id={{number}}>{{number}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 1, "Pre selected count");
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('The correct number of items are pre selected on selected object array', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let numbers = A([
      { item: 1, name: 'One' },
      { item: 2, name: 'Two' },
      { item: 3, name: 'Three' },
      { item: 4, name: 'Four' },
      { item: 5, name: 'Five' }
    ]);

    this.set('numbers', numbers);

    this.set('selected', [numbers[1], numbers[3]]);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{map-value mapper number}} data-id={{number.item}}>{{number.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 2, "Pre selected count");
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('The correct number of items are pre selected on selected object item', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let numbers = A([
      { item: 1, name: 'One' },
      { item: 2, name: 'Two' },
      { item: 3, name: 'Three' },
      { item: 4, name: 'Four' },
      { item: 5, name: 'Five' }
    ]);

    this.set('numbers', numbers);

    this.set('selected', numbers[1]);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{map-value mapper number}} data-id={{number.item}}>{{number.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 1, "Pre selected count");
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  test('The correct number of items get selected when clicked', async function(assert) {
    assert.expect(7);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('numbers', A([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]));

    this.set('selected', []);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{number}} data-id={{number}}>{{number}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Pre selected count");
    this.$('.item[data-id=2]').click();
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(this.get('selected').join(','), ['2'].join(','));

    this.$('.item[data-id=4]').click();
    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(this.get('selected').join(','), ['2', '4'].join(','));
    assert.equal(count, 2, 'onChange should not have been called');
  });

  // clicking binded items updates collection
  test('The correct number of items get selected when clicked', async function(assert) {
    assert.expect(7);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let numbers = A([
      { item: 1, name: 'One' },
      { item: 2, name: 'Two' },
      { item: 3, name: 'Three' },
      { item: 4, name: 'Four' },
      { item: 5, name: 'Five' }
    ]);

    this.set('numbers', numbers);

    this.set('selected', []);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{map-value mapper number}} data-id={{number.item}}>{{number.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Pre selected count");
    this.$('.item[data-id=2]').click();
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(this.get('selected').join(','), [numbers[1]].join(','));

    this.$('.item[data-id=4]').click();
    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(this.get('selected').join(','), [numbers[1], numbers[3]].join(','));
    assert.equal(count, 2, 'onChange should not have been called');
  });
  // setting binded items, updates collection

  test('The correct number of items get selected when array is modified', async function(assert) {
    assert.expect(7);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    this.set('numbers', A([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]));

    this.set('selected', []);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{number}} data-id={{number}}>{{number}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Pre selected count");
    this.set('selected', ['2']);

    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(this.get('selected').join(','), ['2'].join(','));

    begin();
    this.set('selected', ['2', '4']);
    // Have to clear the queue to ensure that property change gets notified
    // Doesn't clear in time on tests occasionally
    end();

    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(this.get('selected').join(','), ['2', '4'].join(','));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  // clicking binded items updates collection
  test('The correct number of items get selected when array bindings is modified', async function(assert) {
    assert.expect(7);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let numbers = A([
      { item: 1, name: 'One' },
      { item: 2, name: 'Two' },
      { item: 3, name: 'Three' },
      { item: 4, name: 'Four' },
      { item: 5, name: 'Five' }
    ]);

    this.set('numbers', numbers);

    this.set('selected', []);

    await render(hbs`
      {{#ui-dropdown class="multiple" selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each numbers as |number|}}
          <div class='item' data-value={{map-value mapper number}} data-id={{number.item}}>{{number.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 5, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Pre selected count");
    this.set('selected', [numbers[1]]);
    assert.ok(this.$('.item[data-id=2]').hasClass('active'));
    assert.equal(this.get('selected').join(','), [numbers[1]].join(','));

    this.set('selected', [numbers[1], numbers[3]]);
    assert.ok(this.$('.item[data-id=4]').hasClass('active'));
    assert.equal(this.get('selected').join(','), [numbers[1], numbers[3]].join(','));
    assert.equal(count, 0, 'onChange should not have been called');
  });

  // Add selected deferred test
  test('it renders and selects the correct item after promise resolves', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferred = defer();

    this.set('selected', deferred.promise);

    this.set('people', [ "Sherlock Homes", "Patrick Bateman" ]);
    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person}}>{{person}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.$('.item.active').length, 0);

    deferred.resolve('Patrick Bateman');

    return afterRender(deferred.promise).then(() => {
      assert.equal(this.$('.item.active').length, 1);
      assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
      assert.equal(count, 0, 'onChange should not have been called');
    });
  });

  // Add selected deferred test
  test('it renders and selects the correct item from resolved promise', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferred = defer();

    deferred.resolve('Patrick Bateman');

    this.set('selected', deferred.promise);

    this.set('people', [ "Sherlock Homes", "Patrick Bateman" ]);
    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed)}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{person}}>{{person}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2);
    assert.equal(this.$('.item.active').length, 1);
    assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
    assert.equal(count, 0, 'onChange should not have been called');
  });

  // Add map-value promise deferred binding test
  test('it renders from a mapper with a promise', async function(assert) {
    assert.expect(5);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferred = defer();

    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferred.promise
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      proxy
    ]));

    this.set('selected', 'Patrick Bateman');

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Right number of items active");

    let deferredValue = { id: 2, name: "Patrick Bateman" };
    deferred.resolve(deferredValue);

    return afterRender(deferred.promise).then(() => {
      assert.equal(this.$('.item.active').length, 1);
      assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
      assert.equal(count, 0, 'onChange should not have been called');
    });
  });

  test('it renders from a mapper with a promise already completed', async function(assert) {
    assert.expect(4);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferred = defer();

    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferred.promise
    });

    let deferredValue = { id: 2, name: "Patrick Bateman" };
    deferred.resolve(deferredValue);

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      proxy
    ]));

    this.set('selected', 'Patrick Bateman');

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    return afterRender(deferred.promise).then(() => {
      return settled().then(() => {
        assert.equal(this.$('.item.active').length, 1, "Right number of items active");
        assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
        assert.equal(count, 0, 'onChange should not have been called');
      });
    });
  });

  test('it renders from a mapper with a promise and select with a promise, select resolving first', async function(assert) {
    assert.expect(6);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferredMap = defer();
    let deferredSelect = defer();

    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferredMap.promise
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      proxy
    ]));

    this.set('selected', deferredSelect.promise);

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Right number of items active");

    deferredSelect.resolve('Patrick Bateman');

    return afterRender(deferredSelect.promise).then(() => {
      return settled().then(() => {
        assert.equal(this.$('.item.active').length, 0, "Right number of items active");

        let deferredValue = { id: 2, name: "Patrick Bateman" };
        deferredMap.resolve(deferredValue);

        return afterRender(deferredMap.promise);
      });
    }).then(() => {
      return settled().then(() => {
        assert.equal(this.$('.item.active').length, 1, "Right number of items active");
        assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
        assert.equal(count, 0, 'onChange should not have been called');
      });
    });
  });

  test('it renders from a mapper with a promise and select with a promise, mapper resolving first', async function(assert) {
    assert.expect(6);

    let count = 0;
    this.set('changed', (value) => {
      this.set('selected', value);
      count++;
    });

    let deferredMap = defer();
    let deferredSelect = defer();

    let ObjectPromiseProxy = ObjectProxy.extend(PromiseProxyMixin);
    let proxy = ObjectPromiseProxy.create({
      promise: deferredMap.promise
    });

    this.set('people', A([
      { id: 1, name: "Sherlock Homes" },
      proxy
    ]));

    this.set('selected', deferredSelect.promise);

    await render(hbs`
      {{#ui-dropdown selected=selected onChange=(action changed) as |execute mapper|}}
        <div class='menu'>
        {{#each people as |person|}}
          <div class='item' data-value={{map-value mapper person}} data-id={{person.id}}>{{person.name}}</div>
        {{/each}}
        </div>
      {{/ui-dropdown}}
    `);

    assert.equal(this.$('.item').length, 2, "Right number of items");
    assert.equal(this.$('.item.active').length, 0, "Right number of items active");

    let deferredValue = { id: 2, name: "Patrick Bateman" };
    deferredMap.resolve(deferredValue);

    return afterRender(deferredMap.promise).then(() => {
      assert.equal(this.$('.item.active').length, 0, "Right number of items active");

      deferredSelect.resolve('Patrick Bateman');

      return afterRender(deferredSelect.promise);
    }).then(() => {
      assert.equal(this.$('.item.active').length, 1, "Right number of items active");
      assert.equal(this.$('.item.active').text(), 'Patrick Bateman');
      assert.equal(count, 0, 'onChange should not have been called');
    });
  });
});
