/* global intlTelInputUtils */

import Component from '@ember/component'
import { assert } from '@ember/debug'
import { attribute, tagName } from '@ember-decorators/component'

const { $ } = window

const PHONE_NUMBER_FORMAT = 'E164' // https://en.wikipedia.org/wiki/E.164

/**
  A phone-input component. Usage:
  ```hbs
    {{phone-input
    number='123'
    autoPlaceholder='aggressive'
    initialCountry='fr'
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

  /**
    The international phone number. This is the main data supposed
    to be persisted / handled.

    @argument number
    @type {string}
  */
  number = this.number || null

  /**
    Add or remove input placeholder with an example number for the selected
    country. Possible values are 'polite', 'aggresive' and 'off'. Defaults to
    'polite'.

    @argument autoPlaceholder
    @type {string}
  */
  autoPlaceholder = this.autoPlaceholder || 'polite'

  /**
    It will just be the first country in the list. Set the initial country by
    it's country code. Defaults to ''.

    @argument initialCountry
    @type {string}
  */
  initialCountry = this.initialCountry || ''

  /**
    Display only the countries you specify -
    [see example](http://jackocnr.com/lib/intl-tel-input/examples/gen/only-countries-europe.html).

    @argument onlyCountries
    @type {Array}
  */
  onlyCountries = this.onlyCountries || undefined

  /**
    Specify the countries to appear at the top of the list.

    @argument preferredCountries
    @type {Array}
  */
  preferredCountries = this.preferredCountries || ['us', 'gb']

  /**
    You have to implement this function to update the `number`.

    @argument update
    @param {string} number The international phoneNumber
    @param {Object} metadata The phoneNumber metadata
    @param {string} metadata.extension The extension part of the current number, so if the number was '+1 (702) 123-1234 ext. 12345' this would return '12345'.
    @param {Object} metadata.selectedCountryData The country data for the currently selected flag.
    @param {boolean} metadata.isValidNumber The validity of the current `phoneNumber`.
  */
  update = this.update || function() {}

  init() {
    super.init(...arguments)

    const validAutoPlaceholer = ['polite', 'aggresive', 'off'].includes(
      this.autoPlaceholder
    )
    assert(
      "`autoPlaceholder` possible values are 'polite', 'aggresive' and 'off'",
      !validAutoPlaceholer
    )
  }

  input() {
    const format = intlTelInputUtils.numberFormat[PHONE_NUMBER_FORMAT]
    const internationalPhoneNumber = $(this.element).intlTelInput(
      'getNumber',
      format
    )

    this.update(internationalPhoneNumber, this._metaData())

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

    $(this.element).intlTelInput({
      autoHideDialCode: true,
      nationalMode: true,
      autoPlaceholder,
      initialCountry,
      onlyCountries,
      preferredCountries
    })

    const number = this.number
    if (number) {
      $(this.element).intlTelInput('setNumber', number)
    }

    this.update(number, this._metaData())
  }

  // this is a trick to format the number on user input
  didRender() {
    this._super(...arguments)

    const number = this.number
    if (number) {
      $(this.element).intlTelInput('setNumber', number)
    }
  }

  willDestroyElement() {
    $(this.element).intlTelInput('destroy')

    super.willDestroyElement(...arguments)
  }

  _metaData() {
    const extension = $(this.element).intlTelInput('getExtension')

    const selectedCountryData = $(this.element).intlTelInput(
      'getSelectedCountryData'
    )

    const isValidNumber = $(this.element).intlTelInput('isValidNumber')

    return {
      extension,
      selectedCountryData,
      isValidNumber
    }
  }
}
