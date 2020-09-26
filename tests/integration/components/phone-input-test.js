import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, render, find } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | phone-input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    await this.owner.lookup('service:phone-input').load();
  });

  test('renders an input of type tel', async function(assert) {
    assert.expect(1);

    await render(hbs`{{phone-input number='1111'}}`);

    assert.dom('input').hasAttribute('type', 'tel');
  });

  test('renders the value', async function(assert) {
    assert.expect(3);

    const newValue = '2';
    this.set('number', null);
    this.set('update', () => {});

    await render(hbs`{{phone-input number=number update=(action update)}}`);

    assert.dom('input').hasValue('');

    this.set('update', value => {
      assert.equal(value, newValue);
      this.set('number', newValue);
    });

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('letters transformation can be disabled', async function (assert) {
    const newValue = '222test';
    this.set('number', null);
    this.set('update', () => { });

    await render(hbs`{{phone-input allowAutoFormat=false number=number update=(action update)}}`);

    assert.dom('input').hasValue('');

    this.set('update', value => {
      this.set('number', newValue);
    });

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('renders the value with separate dial code option', async function(assert) {
    assert.expect(3);

    const newValue = '2';
    this.set('separateDialNumber', null);
    this.set('update', value => {
      this.set('separateDialNumber', value);
    });

    await render(
      hbs`{{phone-input separateDialCode=true number=separateDialNumber update=(action update)}}`
    );

    assert.dom('input').hasValue('');
    assert.dom('.iti__selected-dial-code').hasText('+1');

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('can update the country', async function(assert) {
    assert.expect(2);

    const country = 'us';
    this.set('number', null);
    this.set('update', () => {});
    this.set('country', country);

    await render(
      hbs`{{phone-input country=country number=number update=(action update)}}`
    );

    assert.dom('.iti__flag').hasClass('iti__us');

    this.set('country', 'nz');

    assert.dom('.iti__flag').hasClass('iti__nz');
  });

  test('phoneNumber is correctly invalid when country is changed', async function(assert) {
    assert.expect(2);

    const country = 'fr';
    const validFrenchNumber = '0622334455';
    this.set('number', null);
    this.set('country', country);
    this.set('update', () => {});

    await render(
      hbs`{{phone-input country=country number=number update=(action update)}}`
    );

    this.set('update', (number, { isValidNumber }) => {
      assert.ok(isValidNumber);
    });

    await fillIn('input', validFrenchNumber);

    this.set('update', (number, { isValidNumber }) => {
      assert.notOk(isValidNumber);
    });

    this.set('country', 'pt');
  });

  test('can be disabled', async function(assert) {
    this.set('number', null);
    this.set('update', () => {});

    await render(hbs`{{phone-input number=number update=(action update)}}`);

    assert.notOk(find('input').disabled);

    await render(
      hbs`{{phone-input disabled=true number=number update=(action update)}}`
    );
    assert.ok(find('input').disabled);
  });

  test('can be required', async function(assert) {
    this.set('number', null);

    await render(hbs`{{phone-input number=number}}`);

    assert.notOk(find('input').required);

    await render(hbs`{{phone-input required=true number=number}}`);

    assert.ok(find('input').required);
  });

  test('can prevent the dropdown', async function(assert) {
    assert.expect(1);

    this.set('updateAllowDropdownNumber', () => {});

    await render(
      hbs`{{phone-input allowDropdown=false update=(action updateAllowDropdownNumber)}}`
    );

    assert.dom('ul.country-list').doesNotExist();
  });
});
