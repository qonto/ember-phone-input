/* global intlTelInputUtils */
import Component from '@ember/component'
import { assert } from '@ember/debug'
import { attribute, tagName } from '@ember-decorators/component'
import $ from 'jquery'

const PHONE_NUMBER_FORMAT = 'E164' // https://en.wikipedia.org/wiki/E.164

@tagName('input')
export default class IntlTelInput extends Component {
  @attribute type = 'tel'

  /**
   * internationalPhoneNumber
   * @property {number}
   * @type {string}
   * @default null
   */
  number = this.number || null

  /**
   * Add or remove input placeholder with an example number for the selected
   * country. Possible values are "polite", "aggresive" and "off". Defaults to
   * "polite".
   *
   * @type {string}
   */
  autoPlaceholder = this.autoPlaceholder || 'polite'

  /**
   * It will just be the first country in the list. Set the initial country by
   * it's country code. Defaults to "".
   *
   * @type {string}
   */
  initialCountry = this.initialCountry || ''

  /**
   * Display only the countries you specify -
   * [see example](http://jackocnr.com/lib/intl-tel-input/examples/gen/only-countries-europe.html).
   *
   * @type Array
   */
  onlyCountries = this.onlyCountries || undefined

  /**
   * Specify the countries to appear at the top of the list.
   *
   * @type Array
   */
  preferredCountries = this.preferredCountries || ['us', 'gb']

  /**
   * Implement this function to update the value.
   *
   * @type function
   */
  update = this.update || function() {}

  init() {
    super.init(...arguments)

    const validAutoPlaceholer = ['polite', 'aggresive', 'off'].includes(
      this.autoPlaceholder
    )
    assert(
      '`autoPlaceholder` possible values are "polite", "aggresive" and "off"',
      !validAutoPlaceholer
    )
  }

  input() {
    const format = intlTelInputUtils.numberFormat[PHONE_NUMBER_FORMAT]
    const internationalPhoneNumber = $(this.element).intlTelInput(
      'getNumber',
      format
    )

    /**
     * Get the extension part of the current number, so if the number was
     * "+1 (702) 123-1234 ext. 12345" this would return "12345".
     *
     * @type String
     */
    const extension = $(this.element).intlTelInput('getExtension')

    /**
     * Get the country data for the currently selected flag.
     *
     * @type Object
     */
    const selectedCountryData = $(this.element).intlTelInput(
      'getSelectedCountryData'
    )

    /**
     * Get the validity of the current `phoneNumber`.
     *
     * @type Boolean
     */
    const isValidNumber = $(this.element).intlTelInput('isValidNumber')

    /**
     * Get the validation errors.
     *
     * @type String
     */
    const validationError = this._validationError()

    this.get('update')(internationalPhoneNumber, {
      extension,
      selectedCountryData,
      isValidNumber,
      validationError
    })

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
  }

  // this is a trick to format the number on user input
  didRender() {
    this._super(...arguments)

    const number = this.get('number')
    if (number) {
      this.$().intlTelInput('setNumber', number)
    }
  }

  willDestroyElement() {
    $(this.element).intlTelInput('destroy')

    super.willDestroyElement(...arguments)
  }

  _validationError() {
    let errorNumber = $(this.element).intlTelInput('getValidationError')
    for (let key in intlTelInputUtils.validationError) {
      if (intlTelInputUtils.validationError[key] === errorNumber) {
        return key
      }
    }

    return null
  }
}
