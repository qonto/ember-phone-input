import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router'
import config from './config/environment'

const Router = AddonDocsRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function() {
  docsRoute(this, function() {
    this.route('installation')
    this.route('usage')
    this.route('action-handling')

    this.route('components', function() {
      this.route('phone-input')
    })
  })

  this.route('not-found', { path: '/*path' })
})

export default Router
