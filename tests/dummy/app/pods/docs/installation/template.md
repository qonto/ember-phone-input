# Installation

```sh
ember install ember-phone-input
```

### Configuration

In the `config.environment.js` you can add configurations for {{docs-link 'lazyloading' 'docs.lazy-loading'}} and asset paths.

More information about lazy loading can be found {{docs-link 'here' 'docs.lazy-loading'}}

#### Asset paths
Lazying loading `ember-phone-input`  two files will be downloaded when the `load()` is called.
Those files are by default are concat the `rootURL` for your app. When deploying to production or staging server and you're using a CDN `ember-cli` gives you the [tools](https://ember-cli.com/user-guide/#fingerprinting-and-cdn-urls) to prepend the CDN URL to your assets. You will need to add `hasPrepend: true` to `config.environment.js` for the environments where you are using a CDN.

```js
module.exports = function(environment) {
  const ENV = {
    ...,
    phoneInput: {
      lazyLoad: true,    // default false
      hasPrepend: false  // default false
    }
  }

  if (deployTarget === 'production') {
    ENV.phoneInput.hasPrepend = true;
  }

  return ENV
}
```
