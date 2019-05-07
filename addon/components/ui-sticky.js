import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-sticky';

export default Component.extend(Base, {
  layout,
  module: 'sticky',
  classNames: ['ui', 'sticky']
});
