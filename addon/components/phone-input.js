import Component from '@ember/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';

/**
  A phone-input component. Usage:
  ```hbs
    {{phone-input
    allowDropdown=false
    autoPlaceholder='aggressive'
    disabled=true
    initialCountry='fr'
    number='123'
    onlyCountries=europeanCountries
    preferredCountries=englishSpeakingCountries
    separateDialCode=true
    update=(action 'handleUpdate')}}
  ```

  @class PhoneInput
  @public
*/

export default Component.extend({
  tagName: 'input',

  attributeBindings: ['type', 'disabled'],
  type: 'tel',

  phoneInput: service(),

  init() {
    this._super(...arguments);

    this._iti = this._iti || null;

    /**
     * Setting this to true will disabled the input and the country dropdown.
     * Defaults to `false`
     * @argument disabled
     * @type {boolean}
     */
    this.disabled = this.disabled || false;

    /**
      The international phone number. This is the main data supposed
      to be persisted / handled.

      @argument number
      @type {string}
    */
    this.number = this.number || null;

    /**
      Whether or not to allow the dropdown. If disabled, there is no dropdown arrow, and the selected flag is not clickable. Also we display the selected flag on the right instead because it is just a marker of state.

      @argument allowDropdown
      @type {boolean}
    */

    this.allowDropdown = isPresent(this.allowDropdown)
      ? this.allowDropdown
      : true;

    /**
      Add or remove input placeholder with an example number for the selected
      country. Possible values are 'polite', 'aggressive' and 'off'. Defaults to
      'polite'.

      @argument autoPlaceholder
      @type {string}
    */
    this.autoPlaceholder = this.autoPlaceholder || 'polite';

    /**
      It will just be the first country in the list. Set the initial country by
      it's country code. Defaults to ''.

      @argument initialCountry
      @type {string}
    */
    this.initialCountry = this.initialCountry || '';

    /**
      It will force the selected country. Set the country by it's country code.
      Usefull if you want to provide the component with a country, instead of
      using the built-in country dropdown.
      Defaults to ''.

      @argument country
      @type {string}
    */
    this.country = this.country || '';

    /**
      Display only the countries you specify -
      [see example](http://jackocnr.com/lib/intl-tel-input/examples/gen/only-countries-europe.html).

      @argument onlyCountries
      @type {Array}
    */
    this.onlyCountries = this.onlyCountries || [];

    /**
      Specify the countries to appear at the top of the list.

      @argument preferredCountries
      @type {Array}
    */
    this.preferredCountries = this.preferredCountries || ['us', 'gb'];

    /**
      Display the country dial code next to the selected flag so it's not part of the typed number

      @argument separateDialCode
      @type {boolean}
    */
    this.separateDialCode = this.separateDialCode || false;

    /**
      You have to implement this function to update the `number`.

      @argument update
      @param {string} number The international phoneNumber
      @param {Object} metadata The phoneNumber metadata
      @param {string} metadata.extension The extension part of the current number, so if the number was '+1 (702) 123-1234 ext. 12345' this would return '12345'.
      @param {Object} metadata.selectedCountryData The country data for the currently selected flag.
      @param {boolean} metadata.isValidNumber The validity of the current `phoneNumber`.
    */
    this.update = this.update || function() {};

    const validAutoPlaceholer = ['polite', 'aggressive', 'off'].includes(
      this.autoPlaceholder
    );

    assert(
      "`autoPlaceholder` possible values are 'polite', 'aggressive' and 'off'",
      validAutoPlaceholer
    );
  },

  input() {
    const internationalPhoneNumber = this._iti.getNumber();

    var meta = this._metaData(this._iti);
    this.update(internationalPhoneNumber, meta);

    return true;
  },

  didInsertElement() {
    this._super(...arguments);

    this._loadAndSetup();
  },

  // this is a trick to format the number on user input
  didRender() {
    this._super(...arguments);

    this._formatNumber();
  },

  willDestroyElement() {
    this._iti.destroy();
    this.element.removeEventListener('countrychange', this.onCountryChange);

    this._super(...arguments);
  },

  async _loadAndSetup() {
    await this.phoneInput.load();

    const {
      allowDropdown,
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries,
      separateDialCode
    } = this;

    var input = document.getElementById(this.elementId);
    var _iti = this.phoneInput.intlTelInput(input, {
      autoHideDialCode: true,
      nationalMode: true,
      allowDropdown,
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries,
      separateDialCode
    });

    const number = this.number;
    if (number) {
      _iti.setNumber(number);
    }
    this._iti = _iti;

    if (this.initialCountry) {
      this._iti.setCountry(this.initialCountry);
    }

    this.update(number, this._metaData(_iti));

    this.onCountryChange = () => {
      this._iti.setCountry(this._iti.getSelectedCountryData().iso2);
      this.input();
    };
    this.element.addEventListener('countrychange', this.onCountryChange);

    this._formatNumber();
  },

  _formatNumber() {
    if (!this._iti) {
      return;
    }

    if (this.country) {
      this._iti.setCountry(this.country);
    }

    if (this.number) {
      this._iti.setNumber(this.number);
    }
  },

  _metaData(iti) {
    const extension = iti.getExtension();
    const selectedCountryData = iti.getSelectedCountryData();
    const isValidNumber = iti.isValidNumber();

    return {
      extension,
      selectedCountryData,
      isValidNumber
    };
  }
});
