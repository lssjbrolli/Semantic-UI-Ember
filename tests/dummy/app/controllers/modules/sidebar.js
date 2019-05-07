/* global $ */
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    toggle: function(id) {
      $(`#${id}`).sidebar('toggle');
    }
  }
});
