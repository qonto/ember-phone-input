'use strict'

const Funnel = require('broccoli-funnel')
const MergeTrees = require('broccoli-merge-trees')

const scriptsDestDir = 'assets/ember-phone-input/scripts/'
const intlTelInputScriptName = 'intlTelInput.min.js'
const utilsScriptName = 'utils.js'

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
      destDir: `/${scriptsDestDir}`
    })

    const intlTelInputFiles = new Funnel('node_modules/intl-tel-input', {
      srcDir: '/build/js',
      include: [intlTelInputScriptName, utilsScriptName],
      destDir: `/${scriptsDestDir}`
    })

    return new MergeTrees([jQueryFiles, intlTelInputFiles])
  },

  contentFor(type, config) {
    const { phoneInput, rootURL } = config
    const shouldLazyLoad = phoneInput ? phoneInput.lazyLoad : false

    if (type === 'body-footer' && !shouldLazyLoad) {
      return `
        <script type="text/javascript" src="${rootURL}${scriptsDestDir}${intlTelInputScriptName}"></script>
        <script type="text/javascript" src="${rootURL}${scriptsDestDir}${utilsScriptName}"></script>
      `
    }
  }
}
