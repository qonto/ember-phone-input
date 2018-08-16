'use strict'

const Funnel = require('broccoli-funnel')

module.exports = {
  name: 'ember-phone-input',

  included(app) {
    this._super.included.apply(this, app)

    // images
    app.import('node_modules/intl-tel-input/build/img/flags.png', {
      destDir: 'assets/ember-phone-input/images'
    })
    app.import('node_modules/intl-tel-input/build/img/flags@2x.png', {
      destDir: 'assets/ember-phone-input/images'
    })

    // intlTelInputUtils style
    app.import('node_modules/intl-tel-input/build/css/intlTelInput.css')
    app.import('vendor/ember-phone-input.css')
  },

  treeForPublic() {
    return new Funnel('node_modules/intl-tel-input', {
      srcDir: '/build/js',
      include: ['intlTelInput.min.js', 'utils.js'],
      destDir: '/assets/ember-phone-input/scripts'
    })
  }
}
