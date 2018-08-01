import { module, test } from 'qunit'
import { setupRenderingTest } from 'ember-qunit'
import { render } from '@ember/test-helpers'
import hbs from 'htmlbars-inline-precompile'

module('Integration | Component | intl-tel-input', function(hooks) {
  setupRenderingTest(hooks)

  test('it renders an input of type tel', async function(assert) {
    assert.expect(1)

    await render(hbs`{{intl-tel-input}}`)

    assert.dom('input').hasAttribute('type', 'tel')
  })
})
