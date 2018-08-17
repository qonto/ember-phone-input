import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

module('Unit | Service | phone-input', function(hooks) {
  setupTest(hooks)

  test('it exists', function(assert) {
    const service = this.owner.lookup('service:phone-input')
    assert.ok(service)
  })
})
