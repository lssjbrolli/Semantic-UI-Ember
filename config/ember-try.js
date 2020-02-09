"use strict";

const getChannelURL = require("ember-source-channel-url");

module.exports = async function() {
  return {
    scenarios: [
      {
        name: "ember-lts-3.8",
        npm: {
          devDependencies: {
            "ember-source": "~3.8.0"
          }
        }
      },
      {
        name: "ember-lts-3.12",
        npm: {
          devDependencies: {
            "ember-source": "~3.12.0"
          }
        }
      },
      {
        name: "ember-release",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("release")
          }
        }
      },
      {
        name: "ember-beta",
        npm: {
          devDependencies: {
            "ember-source": await getChannelURL("beta")
          }
        }
      },
      {
        name: "ember-canary",
        npm: {
          devDependencies: {
            "ember-source": urls[2]
          }
        }
      },
      {
        name: "ember-default",
        npm: {
          devDependencies: {}
        }
      },
      {
        name: "ember-classic",
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            "application-template-wrapper": true,
            "default-async-observers": false,
            "template-only-glimmer-components": false
          })
        },
        npm: {
          ember: {
            edition: "classic"
          }
        }
      }
    ],
    useYarn: true
  };
};
