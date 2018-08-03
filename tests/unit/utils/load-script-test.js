import loadScript from 'dummy/utils/load-script'
import { module, test } from 'qunit'

module('Unit | Utility | load-script', function() {
  test('it works', function(assert) {
    let result = loadScript()
    assert.ok(result)
  })
})
