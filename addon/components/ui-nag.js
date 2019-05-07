import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-nag';

export default Component.extend(Base, {
  layout,
  module: 'nag',
  classNames: ['ui', 'nag']
});
