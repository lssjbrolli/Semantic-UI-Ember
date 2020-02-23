"use strict";
const path = require("path");
const walkSync = require("walk-sync");

const defaults = {
  import: {
    css: true,
    javascript: true,
    images: true,
    fonts: true
  },
  source: {
    css: "node_modules/semantic-ui-css",
    javascript: "node_modules/semantic-ui-css",
    images: "node_modules/semantic-ui-css/themes/default/assets/images",
    fonts: "node_modules/semantic-ui-css/themes/default/assets/fonts"
  },
  destination: {
    images: "assets/themes/default/assets/images",
    fonts: "assets/themes/default/assets/fonts"
  }
};

module.exports = {
  name: require("./package").name,
  included() {
    this._super.included.apply(this, arguments);

    if (defaults.import.css) {
      const sourceCss = defaults.source.css;
      this.import({
        development: path.join(sourceCss, "semantic.css"),
        production: path.join(sourceCss, "semantic.min.css")
      });
    }
    this.import("node_modules/semantic-ui-css/semantic.js");

    if (defaults.import.javascript) {
      const sourceJavascript = defaults.source.javascript;
      this.import({
        development: path.join(sourceJavascript, "semantic.js"),
        production: path.join(sourceJavascript, "semantic.min.js")
      });
    }
    if (defaults.import.images) {
      const sourceImage = defaults.source.images;
      const imageOptions = {
        destDir: defaults.destination.images
      };
      this.import(path.join(sourceImage, "flags.png"), imageOptions);
    }

    if (defaults.import.fonts) {
      const sourceFont = defaults.source.fonts;
      const fontOptions = {
        destDir: defaults.destination.fonts
      };
      let fontFiles = walkSync(sourceFont, { directories: false });
      let font;
      for (font of fontFiles) {
        this.import(path.join(sourceFont, font), fontOptions);
      }
    }
  }
};
