# Lazy Loading

By default the `intl-tel-input` and `libphonenumber` scripts are bundled with your app. They weight about `~50ko` after gzipping, so you may want to lazy-load them.

To do so, you'll have to:

- Add this config in your `config/environment.js`:

```js
module.exports = function(environment) {
  const ENV = {
    ...,
    phoneInput: {
      lazyLoad: true
    }
  }

  return ENV
}
```

- Load the scripts when needed:

```js
export default class Route extends Route {
  @service phoneInput;

  async beforeModel() {
    await this.phoneInput.load();
  }
}
```
