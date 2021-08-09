/* eslint-disable prettier/prettier */
export function initialize(appInstance) {
  const config = appInstance.resolveRegistration('config:environment');
  const { lazyLoad } = config.phoneInput;

  if (!lazyLoad) {
    appInstance.lookup('service:phone-input').load();
  }
}

export default {
  initialize
};
