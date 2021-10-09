import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | phone-input', function (hooks) {
  setupTest(hooks);

  test('load is thenable on first and subsequent renders', function (assert) {
    assert.expect(2);

    let service = this.owner.lookup('service:phone-input');

    service.load().then(() => {
      assert.ok(true, 'the first load is thenable');
    });

    service.load().then(() => {
      assert.ok(true, 'the second load is thenable');
    });
  });
});
