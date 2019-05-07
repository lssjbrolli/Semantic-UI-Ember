import Component from '@ember/component';

export default Component.extend({
  showing: false,

  actions: {
    toggle() {
      this.toggleProperty("showing");
    },
    setCopyCode(code) {
      this.$('[data-clipboard-text]').attr('data-clipboard-text', code);
    }
  }

});
