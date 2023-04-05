'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-phone-input']
    },
    'ember-cli-addon-docs': {
      documentingAddonAt: '../ember-phone-input',
      addonSrcFolder: 'app'
    }
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
