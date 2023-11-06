import '@glint/environment-ember-loose';
import type PhoneInputRegistry from 'ember-phone-input/template-registry';

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry extends PhoneInputRegistry {}
}
