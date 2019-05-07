/* global $ */
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    transition: function() {
      $('img').transition('horizontal flip', '500ms');
    }
  }
});
