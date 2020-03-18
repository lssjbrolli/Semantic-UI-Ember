import Application from "../app";
import config from "../config/environment";
import { setApplication } from "@ember/test-helpers";
import { start } from "ember-qunit";

// import $ from "jquery";

setApplication(Application.create(config.APP));

// $.fn.modal.settings.context = "#ember-testing";

start();
