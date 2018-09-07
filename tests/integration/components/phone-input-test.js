import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'
import {
  jQueryMock,
  IntlTelInputUtilsMock
} from 'ember-phone-input/utils/intl-tel-input-mock'

module('Integration | Component | phone-input', function(hooks) {
  setupRenderingTest(hooks)

  hooks.before(function() {
    window.$ = jQueryMock
    window.intlTelInputUtils = IntlTelInputUtilsMock
  })

  test('it renders an input of type tel', async function(assert) {
    assert.expect(1)

    await render(hbs`{{phone-input number='1111'}}`)

    assert.dom('input').hasAttribute('type', 'tel')
  })

  //   test('it renders the value', async function(assert) {
  //     assert.expect(2)

  //     const oldValue = '1111'
  //     const newValue = '2222'
  //     this.set('number', oldValue)
  //     this.set('update', value => {
  //       assert.ok(true, 'update get called')
  //       assert.equal(value, newValue)
  //       this.set('number', newValue)
  //     })

  //     await render(
  //       hbs`{{phone-input number=number update=(action update) data-test-input=true}}`
  //     )

  //     assert.dom('input').hasValue(oldValue)

  //     await fillIn('[data-test-input]', newValue)

  //     assert.dom('input').hasValue(newValue)
  //   })
})
