import Component from '@ember/component';
import Base from '../mixins/base';
import layout from '../templates/components/ui-dimmer';

export default Component.extend(Base, {
  layout,
  module: 'dimmer'
});
