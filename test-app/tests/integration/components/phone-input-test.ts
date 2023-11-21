import type { TestContext as TestContextBase } from '@ember/test-helpers';
import { fillIn, find, render, typeIn, waitUntil } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type PhoneInputService from 'ember-phone-input/services/phone-input';
import type {
  PhoneInputArgs,
  MetaData
} from 'ember-phone-input/components/phone-input';
import { setupRenderingTest } from 'ember-qunit';
import QUnit, { module, test } from 'qunit';

interface TestContext extends PhoneInputArgs, TestContextBase {
  metaData: MetaData | null;
  separateDialNumber: PhoneInputArgs['number'];
  updateAllowDropdownNumber: () => void;
}

const NOOP = (): void => {};

module('Integration | Component | phone-input', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function () {
    const service = this.owner.lookup(
      'service:phone-input'
    ) as unknown as PhoneInputService;
    await service.load();
  });

  test('renders an input of type tel', async function (this: TestContext, assert) {
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number='1111' @update={{this.update}} />`
    );

    assert.dom('input').hasAttribute('type', 'tel');
  });

  test('renders the value', async function (this: TestContext, assert) {
    assert.expect(3);

    const newValue = '2';

    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{action this.update}} />`
    );

    assert.dom('input').hasValue('');

    this.set('update', (number: PhoneInputArgs['number']): void => {
      assert.strictEqual(number, newValue);
      this.set('number', newValue);
    });

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('renders the custom placeholder', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;
    this.customPlaceholder = 'A custom placeholder';

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} @customPlaceholder={{this.customPlaceholder}} />`
    );

    assert.dom('input').hasAttribute('placeholder', this.customPlaceholder);
  });

  test('renders auto placeholder if custom placeholder is not provided', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    assert.dom('input').hasAttribute('placeholder', '(201) 555-0123');
  });

  test('renders the value with separate dial code option', async function (this: TestContext, assert) {
    const newValue = '2';

    this.separateDialNumber = null;
    this.update = (number: PhoneInputArgs['number']): void => {
      this.separateDialNumber = number;
    };

    await render<TestContext>(
      hbs`<PhoneInput @separateDialCode={{true}} @number={{this.separateDialNumber}} @update={{this.update}} />`
    );

    assert.dom('input').hasValue('');
    assert.dom('.iti__selected-dial-code').hasText('+1');

    await fillIn('input', newValue);

    assert.dom('input').hasValue(newValue);
  });

  test('does not insert the dial code by default', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    assert.dom('input').hasValue('');
  });

  test('updates the country', async function (this: TestContext, assert) {
    this.country = 'us';
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @country={{this.country}} @number={{this.number}} @update={{this.update}} />`
    );

    assert.dom('.iti__flag').hasClass('iti__us');

    this.set('country', 'nz');

    assert.dom('.iti__flag').hasClass('iti__nz');
  });

  test('invalidates phone number when country is changed', async function (this: TestContext, assert) {
    assert.expect(7);

    const country = 'fr';
    const validFrenchNumber = '0622334455';

    this.country = country;
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @country={{this.country}} @number={{this.number}} @update={{action this.update}} />`
    );

    this.set(
      'update',
      (
        _number: PhoneInputArgs['number'],
        {
          isValidNumber,
          numberFormat
        }: Pick<MetaData, 'isValidNumber' | 'numberFormat'>
      ): void => {
        assert.ok(isValidNumber);
        assert.strictEqual(numberFormat?.E164, '+33622334455');
        assert.strictEqual(numberFormat?.INTERNATIONAL, '+33 6 22 33 44 55');
        assert.strictEqual(numberFormat?.NATIONAL, '06 22 33 44 55');
        assert.strictEqual(numberFormat?.RFC3966, 'tel:+33-6-22-33-44-55');
      }
    );

    await fillIn('input', validFrenchNumber);

    this.set(
      'update',
      (
        _number: PhoneInputArgs['number'],
        {
          isValidNumber,
          numberFormat
        }: Pick<MetaData, 'isValidNumber' | 'numberFormat'>
      ): void => {
        assert.notOk(isValidNumber);
        assert.strictEqual(numberFormat, null);
      }
    );

    this.set('country', 'pt');
  });

  test('can be disabled', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @disabled={{true}} @number={{this.number}} @update={{this.update}} />`
    );
    assert.ok(find('input')?.disabled);
  });

  test('is required', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @required={{true}} @number={{this.number}} @update={{this.update}} />`
    );

    assert.ok(find('input')?.required);
  });

  test('prevents the dropdown', async function (this: TestContext, assert) {
    this.number = null;
    this.updateAllowDropdownNumber = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @allowDropdown={{false}} @number={{this.number}} @update={{this.updateAllowDropdownNumber}} />`
    );

    assert.dom('ul.country-list').doesNotExist();
  });

  test('sets autocomplete', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @autocomplete={{"tel"}} @number={{this.number}} @update={{this.update}} />`
    );

    assert.strictEqual(find('input')?.autocomplete, 'tel');
  });

  test('updates the country when the user types in the digits from Brazil code', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    await typeIn('input', '+55');

    assert.dom('.iti__flag').hasClass('iti__br');
  });

  test('updates the country when the user types in the digits from Malaysia code', async function (this: TestContext, assert) {
    this.number = null;
    this.update = NOOP;

    await render<TestContext>(
      hbs`<PhoneInput @number={{this.number}} @update={{this.update}} />`
    );

    await typeIn('input', '+60');

    assert.dom('.iti__flag').hasClass('iti__my');
  });

  module('resilience', function (hooks) {
    let originalOnUncaughtException: (error: unknown) => void;

    hooks.before(function () {
      originalOnUncaughtException = QUnit.onUncaughtException;
      QUnit.onUncaughtException = NOOP;
    });

    hooks.after(function () {
      QUnit.onUncaughtException = originalOnUncaughtException;
    });

    test('intl-tel-input is loaded after user interaction', async function (this: TestContext, assert) {
      const service = this.owner.lookup(
        'service:phone-input'
      ) as unknown as PhoneInputService;
      const load = service.load;

      let resolveLoading: ((value: PromiseLike<void> | void) => void) | null =
        null;

      service.load = (): Promise<void> =>
        new Promise((resolve) => (resolveLoading = resolve));

      this.metaData = null;
      this.number = null;
      this.set(
        'update',
        (number: PhoneInputArgs['number'], metaData: MetaData): void => {
          this.set('metaData', metaData);
          this.set('number', number);
        }
      );

      await render<TestContext>(
        hbs`<PhoneInput @number={{this.number}} @update={{action this.update}} />`
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

      (
        resolveLoading as unknown as (value: PromiseLike<void> | void) => void
      )?.(load.call(service));

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

    test('intl-tel-input fails to load', async function (this: TestContext, assert) {
      const tmp = QUnit.onUncaughtException;
      QUnit.onUncaughtException = NOOP;

      const service = this.owner.lookup(
        'service:phone-input'
      ) as unknown as PhoneInputService;

      let rejectLoading: ((reason?: unknown) => void) | null = null;

      service.load = (): Promise<void> =>
        new Promise((_resolve, reject) => (rejectLoading = reject));

      this.number = null;
      this.metaData = null;

      this.update = (
        number: PhoneInputArgs['number'],
        metaData: MetaData
      ): void => {
        this.number = number;
        this.metaData = metaData;
      };

      await render<TestContext>(
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

      (rejectLoading as unknown as (reason?: unknown) => void)?.();

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
