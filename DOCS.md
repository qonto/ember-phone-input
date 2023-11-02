# Documentation

## Installation

```
ember install ember-phone-input
```

or

```
yarn install -D ember-phone-input
```

or

```
npm install --save-dev ember-phone-input
```

or

```
pnpm install -D ember-phone-input
```

### Configuration

In the `config.environment.js` you can add configurations for asset paths.

## Action handling

`ember-phone-input` aims to be maximally flexible and because of that it doesn't try to make strong assumptions about how you want to use it. Instead it embraces DDAU (Data Down Actions Up) philosophy of Ember 2.0 so data flow always is unidirectional and explicit.

Data changes that occur in the component are not propagated to the outside using two-way bindings, but rather they are communicated via the update action.

Note that `ember-phone-input` can function without the `intl-tel-input` and `libphonenumber` scripts being loaded, in case if they load slowly or fail completely, but the user began interacting with the component. In both cases the `<input>` field's value as `number` and an empty `metaData` object is sent as `update` action arguments. If the scripts are loaded later, the component will proceed to initializing the scripts, keeping the value already entered.

### `update` action

```hbs
<PhoneInput @number={{this.number}} @update={{this.handleUpdate}} />
```

## Lazy Loading

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

## API

| Argument           | Type                                                   | Required | Description                                                                                                                                                                                         |
| ------------------ | ------------------------------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| number             | <code>string &vert; null</code>                        | true     | The phone number displayed in the input.                                                                                                                                                            |
| update             | `function`                                             | true     | A callback function that is triggered when the user updates the phone number                                                                                                                        |
| country            | `string`                                               | false    | An optional argument that specifies the default country or country selection for the input.                                                                                                         |
| disabled           | `boolean`                                              | false    | An optional boolean flag that, when set to true, disables the phone number input, preventing user interaction.                                                                                      |
| required           | `boolean`                                              | false    | An optional boolean flag that, when set to true, indicates that the phone number input is a required field. Users must provide a valid phone number.                                                |
| autocomplete       | <code>string&vert;null</code>                          | false    | An optional string value that specifies the autocomplete attribute for the input element. It can be used to control browser autofill behavior.                                                      |
| allowDropdown      | `boolean`                                              | false    | An optional boolean flag that, when set to true, allows a dropdown with country code options to be displayed to the user, making it easier to select the country.                                   |
| autoPlaceholder    | <code>'aggressive' &vert; 'off' &vert; 'polite'</code> | false    | An optional argument that controls the behavior of the placeholder text within the input field. It can be set to 'aggressive', 'off', or 'polite' to define how the placeholder behaves.            |
| customPlaceholder  | <code>string &vert; null</code>                        | false    | An optional custom placeholder text that you can provide for the phone number input. If set, it will be displayed as a placeholder.                                                                 |
| initialCountry     | `string`                                               | false    | An optional argument that specifies the initial country to be displayed in the input when the component is first loaded.                                                                            |
| onlyCountries      | `string[]`                                             | false    | An optional array of country codes that restricts the countries available for selection. Users can only select countries from this list.                                                            |
| preferredCountries | `string[]`                                             | false    | An optional array of country codes that defines a subset of preferred countries. These countries may appear at the top of the country selection list.                                               |
| separateDialCode   | `boolean`                                              | false    | An optional boolean flag that, when set to true, separates the country code (dial code) from the phone number in the input field.                                                                   |
| onError            | `function`                                             | false    | An optional callback function that is triggered when an error occurs during phone number input validation or processing. You can use this function to handle and report errors in your application. |

## Examples

### Basic

```hbs
<PhoneInput
  @initialCountry="us"
  @number={{this.number}}
  @update={{this.handleUpdate}}
/>
```
