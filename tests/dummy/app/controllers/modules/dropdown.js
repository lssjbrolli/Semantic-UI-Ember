import { A } from '@ember/array';
import Controller from '@ember/controller';

export default Controller.extend({
  categories: [
    'Clothing',
    'Home',
    'Bedroom'
  ],

  types: [
    2,
    3,
    true,
    false,
    3.3,
    5.5,
    "string"
  ],

  selected_type: 5.5,

  gender: 0,
  genders: A([
    { id: 1, text: 'Male' },
    { id: 0, text: 'Female' }
  ]),

  country: null,
  country2: null,
  countries: [
    { iso2: 'us', name: 'United States' },
    { iso2: 'ca', name: 'Canada' },
    { iso2: 'mx', name: 'Mexico' }
  ],

  init() {
    this._super(...arguments);
    this.set('gender2', this.get('genders.firstObject'));
    this.set('country2', A([]).pushObjects(this.get('countries')));
  }
});
