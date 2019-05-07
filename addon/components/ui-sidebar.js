import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-sidebar';

export default Component.extend(Base, {
  layout,
  module: 'sidebar',
  classNames: ['ui', 'sidebar']
});
