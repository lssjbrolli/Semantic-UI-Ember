import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-shape';

export default Component.extend(Base, {
  layout,
  module: 'shape',
  classNames: ['ui', 'shape']
});
