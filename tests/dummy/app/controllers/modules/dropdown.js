import { A } from "@ember/array";
import Controller from "@ember/controller";

export default class extends Controller {
  constructor() {
    super(...arguments);
    this.gender2 = this.genders.firstObject;
    this.country2 = A([]).pushObjects(this.countries);
  }
  categories = ["Clothing", "Home", "Bedroom"];

  types = [2, 3, true, false, 3.3, 5.5, "string"];

  selected_type = 5.5;

  gender = 0;
  genders = A([
    { id: 1, text: "Male" },
    { id: 0, text: "Female" }
  ]);

  country = null;
  country2 = null;
  countries = [
    { iso2: "us", name: "United States" },
    { iso2: "ca", name: "Canada" },
    { iso2: "mx", name: "Mexico" }
  ];
}
