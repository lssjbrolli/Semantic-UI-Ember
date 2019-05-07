import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  total_sections: 0,

  sections: computed('total_sections', function() {
    let sections = [];
    let count = this.get('total_sections');
    while (count) {
      sections.push(count);
      count -= 1;
    }
    return sections.sort();
  }),

  actions: {
    change_sections: function(value) {
      let total_sections = this.get('total_sections');
      if ((total_sections + value) < 0) {
        return;
      }
      this.set('total_sections', total_sections + value);
    }
  }
});
