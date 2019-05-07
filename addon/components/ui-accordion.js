import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-accordion';

export default Component.extend(Base, {
  layout,
  module: 'accordion',
  classNames: ['ui', 'accordion']
});
