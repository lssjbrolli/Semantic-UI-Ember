/* global $ */
import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    clear: function() {
      $('.cookie.nag').nag('clear');
      $('.cookie.nag').nag('show');
    }
  }
});
