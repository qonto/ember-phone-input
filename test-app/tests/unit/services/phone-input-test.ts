import type PhoneInputService from 'ember-phone-input/services/phone-input';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | phone-input', function (hooks) {
  setupTest(hooks);

  test('load is thenable on first and subsequent renders', function (assert) {
    assert.expect(2);

    const service = this.owner.lookup(
      'service:phone-input'
    ) as unknown as PhoneInputService;

    service.load().then(() => {
      assert.ok(true, 'the first load is thenable');
    });

    service.load().then(() => {
      assert.ok(true, 'the second load is thenable');
    });
  });
});
