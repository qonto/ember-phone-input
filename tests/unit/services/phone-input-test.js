import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | phone-input', function(hooks) {
  setupTest(hooks)

  test('handles prepended script urls', function(assert) {
    const config = this.owner.resolveRegistration('config:environment')
    config.phoneInput.hasPrepend = true

    const service = this.owner.lookup('service:phone-input')

    const url = 'assets/ember-phone-input/scripts/intlTelInput.min.js'

    const expectedUrl = 'assets/ember-phone-input/scripts/intlTelInput.min.js'
    assert.equal(service._loadUrl(url), expectedUrl)
  })

  test('handles rootURL script urls', function(assert) {
    const config = this.owner.resolveRegistration('config:environment')
    config.phoneInput.hasPrepend = false

    const service = this.owner.lookup('service:phone-input')

    const url = 'assets/ember-phone-input/scripts/intlTelInput.min.js'

    const expectedUrl = '/assets/ember-phone-input/scripts/intlTelInput.min.js'
    assert.equal(service._loadUrl(url), expectedUrl)
  })
})
