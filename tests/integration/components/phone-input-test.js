import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { fillIn, render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | phone-input', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders an input of type tel', async function(assert) {
    assert.expect(1)

    await this.owner.lookup('service:phone-input').load()

    await render(hbs`{{phone-input number='1111'}}`)

    assert.dom('input').hasAttribute('type', 'tel')
  })

  test('it renders the value', async function(assert) {
    assert.expect(3)

    await this.owner.lookup('service:phone-input').load()

    const newValue = '2'
    this.set('number', null)
    this.set('update', () => {})

    await render(hbs`{{phone-input number=number update=(action update)}}`)

    assert.dom('input').hasValue('')

    this.set('update', value => {
      assert.equal(value, newValue)
      this.set('number', newValue)
    })

    await fillIn('input', newValue)

    assert.dom('input').hasValue(newValue)
  })

  test('it can update the country', async function(assert) {
    assert.expect(2)

    await this.owner.lookup('service:phone-input').load()

    const country = 'us'
    this.set('number', null)
    this.set('update', () => {})
    this.set('country', country)

    await render(
      hbs`{{phone-input country=country number=number update=(action update)}}`
    )

    assert.dom('.iti-flag').hasClass('us')

    this.set('country', 'nz')

    assert.dom('.iti-flag').hasClass('nz')
  })
})
