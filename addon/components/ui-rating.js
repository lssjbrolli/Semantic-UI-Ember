/* eslint-disable ember/require-tagless-components */
/* eslint-disable ember/no-classic-components */
import Component from "@ember/component";
import Base from "../mixins/base";

export default class UiRatingComponent extends Component.extend(Base) {
  module = "rating";
  classNames = ["ui", "rating"];
  ignorableAttrs = ["rating"];

  willInitSemantic(settings) {
    super.willInitSemantic(...arguments);
    if (settings.initialRating == null && this.rating) {
      settings.initialRating = this.rating;
    }
  }
}
