import { module, test } from 'qunit';
import { visit, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | callstack bug', function(hooks) {
  setupApplicationTest(hooks);

  test('deleting the phone number shouldnt cause a callstack error', async function(assert) {
    await visit('/bugs/callstack');

    await fillIn('[data-test-phone-input]', '+3');

    assert.dom('[data-test-phone-input]').hasValue('+3');
  });
});
