import { later } from '@ember/runloop';
import Component from '@ember/component';

const copyMessage = "Copy Code";

export default Component.extend({
  classNames: ['html'],
  classNameBindings: ['showing:ui', 'showing:top', 'showing:attached', 'showing:segment'],

  copyMessage: copyMessage,

  actions: {
    copied() {
      this.set('copyMessage', 'Copied to Clipboard');
      later(this, () => this.set('copyMessage', copyMessage), 1000);
    },
    copyError() {
      this.set('copyMessage', 'There was an error copying to Clipboard');
      later(this, () => this.set('copyMessage', copyMessage), 1000);
    }
  }

});