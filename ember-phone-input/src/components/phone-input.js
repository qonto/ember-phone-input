import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { inject as service } from '@ember/service';
import { isPresent } from '@ember/utils';
import { action } from '@ember/object';

import 'intl-tel-input/build/css/intlTelInput.css';
import '../styles/styles.css';

/**
  A phone-input component. Usage:
  ```hbs
    <PhoneInput
    allowDropdown=false
    autoPlaceholder='aggressive'
    customPlaceholder='Enter phone number'
    disabled=true
    required=required
    autocomplete=autocomplete
    initialCountry='fr'
    number='123'
    onlyCountries=europeanCountries
    preferredCountries=englishSpeakingCountries
    separateDialCode=true
    update=(action 'handleUpdate')/>
  ```

  @class PhoneInput
  @public
*/

export default class PhoneInputComponent extends Component {
  @service phoneInput;

  type = 'tel';

  /**
   * It will force the selected country. Set the country by it's country code.
   * Useful if you want to provide the component with a country, instead of
   * using the built-in country dropdown.
   * Defaults to ''.
   * @argument country
   * @type {string}
   */
  get country() {
    return this.args.country || '';
  }

  /**
   * The international phone number. This is the main data supposed
   * to be persisted / handled.
   * @argument number
   * @type {string|null}
   */
  get number() {
    return this.args.number || null;
  }

  /**
   * Setting this to true will disable the input and the country dropdown.
   * Defaults to `false`
   * @argument disabled
   * @type {boolean}
   */
  get disabled() {
    return this.args.disabled || false;
  }

  /**
   * Setting this to true will make the input field required. This will enable client side form validation.
   * Defaults to `false`
   * @argument required
   * @type {boolean}
   */
  get required() {
    return this.args.required || false;
  }

  /**
   * `autocomplete` attribute on input field. Can be used to support browser autocompletion.
   * Defaults to `null`
   * @argument autocomplete
   * @type {string|null}
   */
  get autocomplete() {
    return this.args.autocomplete || null;
  }

  /**
   * Whether or not to allow the dropdown. If disabled, there is no dropdown arrow, and the selected flag is not clickable. Also we display the selected flag on the right instead because it is just a marker of state.
   * @argument allowDropdown
   * @type {boolean}
   */
  get allowDropdown() {
    return isPresent(this.args.allowDropdown) ? this.args.allowDropdown : true;
  }

  /**
   * Add or remove input placeholder with an example number for the selected
   * country. Possible values are 'polite', 'aggressive' and 'off'. Defaults to
   * 'polite'.
   * @argument autoPlaceholder
   * @type {string}
   */

  get autoPlaceholder() {
    return this.args.autoPlaceholder || 'polite';
  }

  /**
   * Replace the auto placeholder with a custom placeholder.
   * If defined, must return a string. Defaults to null.
   * @argument customPlaceholder
   * @type {string|null}
   */
  get customPlaceholder() {
    return this.args.customPlaceholder || null;
  }

  /**
   * It will just be the first country in the list. Set the initial country by
   * its country code. Defaults to ''.
   * @argument initialCountry
   * @type {string}
   */
  get initialCountry() {
    return this.args.initialCountry || '';
  }

  /**
   * Display only the countries you specify -
   * [see example](http://jackocnr.com/lib/intl-tel-input/examples/gen/only-countries-europe.html).
   * @argument onlyCountries
   * @type {Array}
   */

  get onlyCountries() {
    return this.args.onlyCountries || [];
  }

  /**
   * Specify the countries to appear at the top of the list.
   * @argument preferredCountries
   * @type {Array}
   */
  get preferredCountries() {
    return this.args.preferredCountries || ['us', 'gb'];
  }

  /**
   * Display the country dial code next to the selected flag so it's not part of the typed number
   * @argument separateDialCode
   * @type {boolean}
   */
  get separateDialCode() {
    return this.args.separateDialCode || false;
  }

  _iti = null;

  constructor() {
    super(...arguments);

    /**
     * You have to implement this function to update the `number`.
     * @argument update
     * @param {string} number The international phoneNumber
     * @param {Object} metadata The phoneNumber metadata
     * @param {string} metadata.extension The extension part of the current number, so if the number was '+1 (702) 123-1234 ext. 12345' this would return '12345'.
     * @param {Object} metadata.selectedCountryData The country data for the currently selected flag.
     * @param {boolean} metadata.isValidNumber The validity of the current `phoneNumber`.
     */

    this.update = this.args.update || function () {};

    if (this.customPlaceholder) {
      assert(
        '`customPlaceholder` must be of type string',
        typeof this.customPlaceholder === 'string'
      );
    }

    const validAutoPlaceholder = ['polite', 'aggressive', 'off'].includes(
      this.autoPlaceholder
    );

    assert(
      "`autoPlaceholder` possible values are 'polite', 'aggressive' and 'off'",
      validAutoPlaceholder
    );
  }

  @action
  onInput(event) {
    const internationalPhoneNumber =
      this._iti?.getNumber() ?? event?.target.value;

    var meta = this._metaData(this._iti);
    this.update(internationalPhoneNumber, meta);

    return true;
  }

  @action
  onDidUpdate() {
    this._formatNumber();
  }

  @action
  onDidInsert(element) {
    this.element = element;
    this._loadAndSetup();
  }

  @action
  onDestroy(element) {
    this._iti?.destroy();
    element.removeEventListener('countrychange', this._onCountryChange);
  }

  async _loadAndSetup() {
    try {
      this.isLoadingIti = true;

      await this.phoneInput.load();

      // Even if the above promise resolves, it might be at the end of the
      // component lifecycle
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      this._setupLibrary();

      this._formatNumber();

      this.element.addEventListener(
        'countrychange',
        this._onCountryChange.bind(this)
      );
    } catch (error) {
      this.args.onError?.(error);
    } finally {
      if (!this.isDestroying && !this.isDestroyed) {
        this.isLoadingIti = false;
      }
    }
  }

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
  }

  _setupLibrary() {
    const {
      allowDropdown,
      autoPlaceholder,
      customPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries,
      separateDialCode
    } = this;

    let options = {
      autoInsertDialCode: false,
      nationalMode: true,
      allowDropdown,
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries,
      separateDialCode
    };

    if (customPlaceholder) {
      options.customPlaceholder = () => customPlaceholder;
    }

    let _iti = this.phoneInput.intlTelInput(this.element, options);

    if (this.number) {
      _iti.setNumber(this.number);
    }
    this._iti = _iti;

    if (this.initialCountry) {
      this._iti.setCountry(this.initialCountry);
    }

    this.update(this.number, this._metaData(_iti));
  }

  _metaData(iti) {
    if (!iti) {
      // Libraries may rely on always receiving an object
      return {};
    }

    const extension = iti.getExtension();
    const selectedCountryData = iti.getSelectedCountryData();
    const isValidNumber = iti.isValidNumber();
    const E164 = iti.getNumber(intlTelInputUtils.numberFormat.E164);
    const INTERNATIONAL = iti.getNumber(
      intlTelInputUtils.numberFormat.INTERNATIONAL
    );
    const NATIONAL = iti.getNumber(intlTelInputUtils.numberFormat.NATIONAL);
    const RFC3966 = iti.getNumber(intlTelInputUtils.numberFormat.RFC3966);

    return {
      extension,
      selectedCountryData,
      isValidNumber,
      numberFormat: isValidNumber
        ? {
            E164,
            INTERNATIONAL,
            NATIONAL,
            RFC3966
          }
        : null
    };
  }

  _onCountryChange() {
    const selectedCountry = this._iti.getSelectedCountryData();

    if (selectedCountry.iso2) {
      this._iti.setCountry(selectedCountry.iso2);
    }

    this.onInput();
  }
}
