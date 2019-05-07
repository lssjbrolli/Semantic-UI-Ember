import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-progress';

export default Component.extend(Base, {
  layout,
  module: 'progress',
  classNames: ['ui', 'progress'],
  ignorableAttrs: ['progress']
});
