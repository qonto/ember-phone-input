'use strict';

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: [require.resolve('ember-auto-import/babel-plugin')]
    }
  },

  included(app) {
    this._super.included.apply(this, app);

    // images
    // they get copied to destDir
    app.import('node_modules/intl-tel-input/build/img/flags.png', {
      destDir: 'assets/ember-phone-input/images'
    });
    app.import('node_modules/intl-tel-input/build/img/flags@2x.png', {
      destDir: 'assets/ember-phone-input/images'
    });

    // intlTelInputUtils style
    // it get merged into vendor.css
    app.import('node_modules/intl-tel-input/build/css/intlTelInput.css');
    app.import('vendor/ember-phone-input.css');
  }
};
