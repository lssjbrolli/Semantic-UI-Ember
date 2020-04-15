import BaseComponent from "./base";

export default class UiRatingComponent extends BaseComponent {
  module = "rating";

  willInitSemantic(settings) {
    if (settings.initialRating == null && this.args.rating) {
      settings.initialRating = this.args.rating;
    }
    super.willInitSemantic(...arguments);
  }
}
