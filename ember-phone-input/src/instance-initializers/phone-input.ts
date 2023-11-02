import type ApplicationInstance from '@ember/application/instance';
import type PhoneInputService from '../services/phone-input';

export function initialize(appInstance: ApplicationInstance): void {
  const config = appInstance.resolveRegistration('config:environment') as
    | { phoneInput: { lazyLoad: boolean } | undefined }
    | undefined;
  const lazyLoad = config?.phoneInput?.lazyLoad;

  if (!lazyLoad) {
    (appInstance.lookup('service:phone-input') as PhoneInputService).load();
  }
}

export default {
  initialize
};
