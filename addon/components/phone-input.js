/* global intlTelInputUtils */

import Component from '@ember/component'
import { assert } from '@ember/debug'
import { attribute, tagName } from '@ember-decorators/component'

const { intlTelInput } = window

const PHONE_NUMBER_FORMAT = 'E164' // https://en.wikipedia.org/wiki/E.164

/**
  A phone-input component. Usage:
  ```hbs
    {{phone-input
    autoPlaceholder='aggressive'
    initialCountry='fr'
    number='123'
    onlyCountries=europeanCountries
    preferredCountries=englishSpeakingCountries
    update=(action 'handleUpdate')}}
  ```

  @class PhoneInput
  @public
*/
@tagName('input')
export default class PhoneInput extends Component {
  @attribute
  type = 'tel'

  init() {
    super.init(...arguments)

    this._iti = this._iti || null

    /**
      The international phone number. This is the main data supposed
      to be persisted / handled.

      @argument number
      @type {string}
    */
    this.number = this.number || null

    /**
      Add or remove input placeholder with an example number for the selected
      country. Possible values are 'polite', 'aggressive' and 'off'. Defaults to
      'polite'.

      @argument autoPlaceholder
      @type {string}
    */
    this.autoPlaceholder = this.autoPlaceholder || 'polite'

    /**
      It will just be the first country in the list. Set the initial country by
      it's country code. Defaults to ''.

      @argument initialCountry
      @type {string}
    */
    this.initialCountry = this.initialCountry || ''

    /**
      Display only the countries you specify -
      [see example](http://jackocnr.com/lib/intl-tel-input/examples/gen/only-countries-europe.html).

      @argument onlyCountries
      @type {Array}
    */
    this.onlyCountries = this.onlyCountries || []

    /**
      Specify the countries to appear at the top of the list.

      @argument preferredCountries
      @type {Array}
    */
    this.preferredCountries = this.preferredCountries || ['us', 'gb']

    /**
      You have to implement this function to update the `number`.

      @argument update
      @param {string} number The international phoneNumber
      @param {Object} metadata The phoneNumber metadata
      @param {string} metadata.extension The extension part of the current number, so if the number was '+1 (702) 123-1234 ext. 12345' this would return '12345'.
      @param {Object} metadata.selectedCountryData The country data for the currently selected flag.
      @param {boolean} metadata.isValidNumber The validity of the current `phoneNumber`.
    */
    this.update = this.update || function() {}

    const validAutoPlaceholer = ['polite', 'aggressive', 'off'].includes(
      this.autoPlaceholder
    )

    assert(
      "`autoPlaceholder` possible values are 'polite', 'aggressive' and 'off'",
      validAutoPlaceholer
    )
  }

  input() {
    const format = intlTelInputUtils.numberFormat[PHONE_NUMBER_FORMAT]
    const internationalPhoneNumber = this._iti.getNumber(format)

    var meta = this._metaData(this._iti)
    this.update(internationalPhoneNumber, meta)

    return true
  }

  didInsertElement() {
    super.didInsertElement(...arguments)

    const {
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries
    } = this

    var input = document.getElementById(this.elementId)
    var _iti = intlTelInput(input, {
      autoHideDialCode: true,
      nationalMode: true,
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries
    })

    const number = this.number
    if (number) {
      _iti.setNumber(number)
    }
    this._iti = _iti

    this.update(number, this._metaData(_iti))
  }

  // this is a trick to format the number on user input
  didRender() {
    this._super(...arguments)

    if (this.number && this._iti) {
      this._iti.setNumber(this.number)
    }
  }

  willDestroyElement() {
    this._iti.destroy()

    super.willDestroyElement(...arguments)
  }

  _metaData(iti) {
    const extension = iti.getExtension()
    const selectedCountryData = iti.getSelectedCountryData()
    const isValidNumber = iti.isValidNumber()

    return {
      extension,
      selectedCountryData,
      isValidNumber
    }
  }
}
