import Helper from '@ember/component/helper';
import PromiseResolver from 'ember-promise-utils/mixins/promise-resolver';

export default Helper.extend(PromiseResolver, {
  compute([action, maybePromise]) {
    return this.resolvePromise(maybePromise, function(value) {
      return action(value);
    }, function() {
      this.recompute();
      return null;
    });
  }
});
