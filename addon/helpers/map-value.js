import Helper from "@ember/component/helper";
import PromiseResolver from "ember-promise-utils/mixins/promise-resolver";

export default class MapValueHelper extends Helper.extend(PromiseResolver) {
  compute([action, maybePromise]) {
    return this.resolvePromise(
      maybePromise,
      value => {
        return action(value);
      },
      () => {
        this.recompute();
        return null;
      }
    );
  }
}
