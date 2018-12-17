import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | phone-input', function(hooks) {
  setupTest(hooks)

  test('it exists', function(assert) {
    const service = this.owner.lookup('service:phone-input')
    assert.ok(service)
  })

  test('handles prepended script urls', function(assert) {
    const config = this.owner.resolveRegistration('config:environment')
    config.phoneInput.prepend = true

    const service = this.owner.lookup('service:phone-input')

    const url = `assets/ember-phone-input/scripts/intlTelInput.min.js`

    const expectedUrl = `assets/ember-phone-input/scripts/intlTelInput.min.js`
    assert.equal(service._loadUrl(url), expectedUrl)
  })

  test('handles rootURL script urls', function(assert) {
    const service = this.owner.lookup('service:phone-input')

    const url = `assets/ember-phone-input/scripts/intlTelInput.min.js`

    const expectedUrl = `/assets/ember-phone-input/scripts/intlTelInput.min.js`
    assert.equal(service._loadUrl(url), expectedUrl)
  })
})
