import AddonDocsRouter, { docsRoute } from 'ember-cli-addon-docs/router';
import config from 'dummy/config/environment';

export default class Router extends AddonDocsRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  docsRoute(this, function() {
    this.route('installation');
    this.route('usage');
    this.route('action-handling');
    this.route('lazy-loading');

    this.route('components', function() {
      this.route('phone-input');
    });
  });

  this.route('bugs', function() {
    this.route('callstack');
  });

  this.route('not-found', { path: '/*path' });
});
