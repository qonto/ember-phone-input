import Service from '@ember/service';
import { resolve, all } from 'rsvp';
import type intlTelInput from 'intl-tel-input';

export default class PhoneInputService extends Service {
  intlTelInput:
    | ((
        node: Element,
        options?: intlTelInput.Options | undefined
      ) => intlTelInput.Plugin)
    | null = null;

  async load(): Promise<void> {
    if (this.intlTelInput) return resolve();

    return all([
      import('intl-tel-input'),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/prefer-ts-expect-error
      // @ts-ignore
      // We need to ignore ts and eslint here because intlTelUtils types are not exported which makes the default module untyped
      import('intl-tel-input/build/js/utils.js')
    ]).then(([intlTelInput]) => {
      if (!this.isDestroying && !this.isDestroyed) {
        this.intlTelInput = intlTelInput.default;
      }
    });
  }
}
