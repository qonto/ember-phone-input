import config from '../config/environment'

export function initialize() {
  const application = arguments[1] || arguments[0]
  let phoneInputConfig = config.phoneInput || {}

  application.register('config:phoneInput', phoneInputConfig, {
    instantiate: false
  })
  application.inject('service:phoneInput', 'config', 'config:phoneInput')
}

export default {
  name: 'ember-phone-input',
  initialize
}
