import QUnit, { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, render, find, typeIn, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | phone-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    await this.owner.lookup('service:phone-input').load();
  });

  test('renders an input of type tel', async function (assert) {
    assert.expect(1);

    await render(hbs`{{phone-input number='1111'}}`);

    assert.dom('input').hasAttribute('type', 'tel');
  });

  test('renders the value', async function (assert) {
    assert.expect(4);

    let newValue = '2';
    this.set('number', null);
    this.set('update', () => {});

    await render(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    assert.dom('input').hasValue('');

    this.set('update', (value) => {
      assert.strictEqual(value, newValue);
      this.set('number', newValue);
    });

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);

    this.set('number', null);
    newValue = null;

    assert.dom('input').hasValue('');
  });

  test('renders the custom placeholder', async function (assert) {
    assert.expect(1);

    this.set('number', null);
    this.set('update', () => {});
    this.set('customPlaceholder', 'A custom placeholder');

    await render(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} @customPlaceholder={{this.customPlaceholder}} />`
    );

    assert.dom('input').hasAttribute('placeholder', this.customPlaceholder);
  });

  test('renders auto placeholder if custom placeholder is not provided', async function (assert) {
    this.set('number', null);
    this.set('update', () => {});

    await render(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    assert.dom('input').hasAttribute('placeholder', '(201) 555-0123');
  });

  test('renders the value with separate dial code option', async function (assert) {
    assert.expect(3);

    const newValue = '2';
    this.set('separateDialNumber', null);
    this.set('update', (value) => {
      this.set('separateDialNumber', value);
    });

    await render(
      hbs`<PhoneInput @separateDialCode={{true}} @number={{this.separateDialNumber}} @update={{action this.update}} />`
    );

    assert.dom('input').hasValue('');
    assert.dom('.iti__selected-dial-code').hasText('+1');

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('should not insert the dial code by default', async function (assert) {
    await render(hbs`<PhoneInput />`);

    assert.dom('input').hasValue('');
  });

  test('can update the country', async function (assert) {
    assert.expect(2);

    const country = 'us';
    this.set('number', null);
    this.set('update', () => {});
    this.set('country', country);

    await render(
      hbs`<PhoneInput @country={{this.country}} @number={{this.number}} @update={{action this.update}} />`
    );

    assert.dom('.iti__flag').hasClass('iti__us');

    this.set('country', 'nz');

    assert.dom('.iti__flag').hasClass('iti__nz');
  });

  test('phoneNumber is correctly invalid when country is changed', async function (assert) {
    assert.expect(7);

    const country = 'fr';
    const validFrenchNumber = '0622334455';
    this.set('number', null);
    this.set('country', country);
    this.set('update', () => {});

    await render(
      hbs`<PhoneInput @country={{this.country}} @number={{this.number}} @update={{action this.update}} />`
    );

    this.set('update', (number, { isValidNumber, numberFormat }) => {
      assert.ok(isValidNumber);
      assert.strictEqual(numberFormat.E164, '+33622334455');
      assert.strictEqual(numberFormat.INTERNATIONAL, '+33 6 22 33 44 55');
      assert.strictEqual(numberFormat.NATIONAL, '06 22 33 44 55');
      assert.strictEqual(numberFormat.RFC3966, 'tel:+33-6-22-33-44-55');
    });

    await fillIn('input', validFrenchNumber);

    this.set('update', (number, { isValidNumber, numberFormat }) => {
      assert.notOk(isValidNumber);
      assert.strictEqual(numberFormat, null);
    });

    this.set('country', 'pt');
  });

  test('can be disabled', async function (assert) {
    this.set('number', null);
    this.set('update', () => {});

    await render(
      hbs`<PhoneInput @number={{this.number}} @update={{action this.update}} />`
    );

    assert.notOk(find('input').disabled);

    await render(
      hbs`<PhoneInput @disabled={{true}} @number={{this.number}} @update={{action this.update}} />`
    );
    assert.ok(find('input').disabled);
  });

  test('can be required', async function (assert) {
    this.set('number', null);

    await render(hbs`<PhoneInput @number={{this.number}} />`);

    assert.notOk(find('input').required);

    await render(
      hbs`<PhoneInput @required={{true}} @number={{this.number}} />`
    );

    assert.ok(find('input').required);
  });

  test('can prevent the dropdown', async function (assert) {
    assert.expect(1);

    this.set('updateAllowDropdownNumber', () => {});

    await render(
      hbs`<PhoneInput @allowDropdown={{false}} @update={{action this.updateAllowDropdownNumber}} />`
    );

    assert.dom('ul.country-list').doesNotExist();
  });

  test('can set autocomplete', async function (assert) {
    await render(hbs`<PhoneInput @autocomplete={{"tel"}} />`);

    assert.strictEqual(find('input').autocomplete, 'tel');
  });

  test('can update the country when the user types in the digits from Brazil code', async function (assert) {
    assert.expect(1);

    await render(hbs`<PhoneInput />`);

    await typeIn('input', '+55');

    assert.dom('.iti__flag').hasClass('iti__br');
  });

  test('can update the country when the user types in the digits from Malaysia code', async function (assert) {
    assert.expect(1);

    await render(hbs`<PhoneInput />`);

    await typeIn('input', '+60');

    assert.dom('.iti__flag').hasClass('iti__my');
  });

  module('resilience', function (hooks) {
    let originalOnUncaughtException;

    hooks.before(function () {
      originalOnUncaughtException = QUnit.onUncaughtException;
      QUnit.onUncaughtException = () => {};
    });

    hooks.after(function () {
      QUnit.onUncaughtException = originalOnUncaughtException;
    });

    test('intl-tel-input is loaded after user interaction', async function (assert) {
      let service = this.owner.lookup('service:phone-input');
      let load = service.load;
      let resolveLoading;

      service.load = () => new Promise((resolve) => (resolveLoading = resolve));

      this.number = null;
      this.metaData = null;

      this.set('update', (value, metaData) => {
        this.set('number', value);
        this.set('metaData', metaData);
      });

      await render(
        hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
      );

      assert.dom('input').doesNotHaveAttribute('data-intl-tel-input-id');

      assert.strictEqual(
        this.number,
        null,
        'number is null when rendered but intl-tel-input is not loaded yet'
      );
      assert.strictEqual(
        this.metaData,
        null,
        'metaData is null when rendered but intl-tel-input is not loaded yet'
      );

      await fillIn('input', '9');

      assert.strictEqual(
        this.number,
        '9',
        'number is correct after input without intl-tel-input'
      );
      assert.deepEqual(
        this.metaData,
        {},
        'metaData is an empty object after input without intl-tel-input'
      );

      resolveLoading(load.call(service));

      await waitUntil(() => find('input:not([data-test-loading-iti])'));

      assert.dom('input').hasAttribute('data-intl-tel-input-id');

      assert.strictEqual(
        this.number,
        '9',
        'number is correct after intl-tel-input is loaded'
      );

      assert.deepEqual(
        this.metaData,
        {
          extension: '',
          isValidNumber: false,
          numberFormat: null,
          selectedCountryData: {}
        },
        'metaData is correct after intl-tel-input is loaded'
      );

      await fillIn('input', '8');

      assert.strictEqual(
        this.number,
        '8',
        'number is correct after input when the intl-tel-input is loaded'
      );

      assert.deepEqual(
        this.metaData,
        {
          extension: '',
          isValidNumber: false,
          numberFormat: null,
          selectedCountryData: {}
        },
        'metaData is correct after input when the intl-tel-input is loaded'
      );
    });

    test('intl-tel-input fails to load', async function (assert) {
      let tmp = QUnit.onUncaughtException;
      QUnit.onUncaughtException = () => {};

      let service = this.owner.lookup('service:phone-input');
      let rejectLoading;

      service.load = () =>
        new Promise((_resolve, reject) => (rejectLoading = reject));

      this.number = null;
      this.metaData = null;

      this.set('update', (value, metaData) => {
        this.set('number', value);
        this.set('metaData', metaData);
      });

      await render(
        hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
      );

      assert.dom('input').doesNotHaveAttribute('data-intl-tel-input-id');

      assert.strictEqual(
        this.number,
        null,
        'number is null when rendered but intl-tel-input is not loaded yet'
      );
      assert.strictEqual(
        this.metaData,
        null,
        'metaData is null when rendered but intl-tel-input is not loaded yet'
      );

      await fillIn('input', '9');

      assert.strictEqual(
        this.number,
        '9',
        'number is correct after input without intl-tel-input'
      );
      assert.deepEqual(
        this.metaData,
        {},
        'metaData is an empty object after input without intl-tel-input'
      );

      rejectLoading();

      await waitUntil(() => find('input:not([data-test-loading-iti])'));

      assert.dom('input').doesNotHaveAttribute('data-intl-tel-input-id');

      await fillIn('input', '8');

      assert.strictEqual(
        this.number,
        '8',
        'number is correct when intl-tel-input is loaded'
      );

      assert.deepEqual(
        this.metaData,
        {},
        'metaData is correct when intl-tel-input is loaded'
      );

      QUnit.onUncaughtException = tmp;
    });
  });
});
