'use strict'

const Funnel = require('broccoli-funnel')
const MergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-phone-input',

  included(app) {
    this._super.included.apply(this, app)

    // images
    // they get copied to destDir
    app.import('node_modules/intl-tel-input/build/img/flags.png', {
      destDir: 'assets/ember-phone-input/images'
    })
    app.import('node_modules/intl-tel-input/build/img/flags@2x.png', {
      destDir: 'assets/ember-phone-input/images'
    })

    // intlTelInputUtils style
    // it get merged into vendor.css
    app.import('node_modules/intl-tel-input/build/css/intlTelInput.css')
    app.import('vendor/ember-phone-input.css')
  },

  treeForPublic() {
    // copy these files to destDir
    // to be able to lazyLoad them || not to bundle them into vendor.js
    const jQueryFiles = new Funnel('node_modules/jquery', {
      srcDir: '/dist',
      include: ['jquery.slim.js'],
      destDir: '/assets/ember-phone-input/scripts'
    })

    const intlTelInputFiles = new Funnel('node_modules/intl-tel-input', {
      srcDir: '/build/js',
      include: ['intlTelInput.min.js', 'utils.js'],
      destDir: '/assets/ember-phone-input/scripts'
    })

    return new MergeTrees([jQueryFiles, intlTelInputFiles])
  }
}
