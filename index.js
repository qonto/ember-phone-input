'use strict'

module.exports = {
  name: 'ember-intl-tel-input',

  included(app) {
    this._super.included.apply(this, app)

    // main script
    app.import({
      development: 'node_modules/intl-tel-input/build/js/intlTelInput.js',
      production: 'node_modules/intl-tel-input/build/js/intlTelInput.min.js'
    })
    // intlTelInputUtils global
    app.import('node_modules/intl-tel-input/build/js/utils.js')

    // images
    app.import('node_modules/intl-tel-input/build/img/flags.png', {
      destDir: 'assets/images'
    })
    app.import('node_modules/intl-tel-input/build/img/flags@2x.png', {
      destDir: 'assets/images'
    })

    // intlTelInputUtils style
    app.import({
      development: 'node_modules/intl-tel-input/build/css/intlTelInput.css',
      production: 'node_modules/intl-tel-input/build/css/intlTelInput.min.css'
    })
    app.import('vendor/ember-phone-input.css')
  }
}
