import Service from '@ember/service'
import { getOwner } from '@ember/application'
import loadScript from 'ember-phone-input/utils/load-script'

export default class PhoneInputService extends Service {
  didLoad = this.didLoad || false

  init() {
    super.init(...arguments)

    const config = getOwner(this).resolveRegistration('config:environment')
    const { lazyLoad } = config.phoneInput

    if (!lazyLoad) {
      // if lazyLoad is disabled, load them now
      // that is to say at the app boot
      this.load()
    }
  }

  load() {
    const { rootURL } = getOwner(this).resolveRegistration('config:environment')

    const doLoadJquery = window.jQuery
      ? Promise.resolve()
      : loadScript(`${rootURL}assets/ember-phone-input/scripts/jquery.min.js`)

    const doLoadScript1 = this.didLoad
      ? Promise.resolve()
      : loadScript(
          `${rootURL}assets/ember-phone-input/scripts/intlTelInput.min.js`
        )

    const doLoadScript2 = this.didLoad
      ? Promise.resolve()
      : loadScript(`${rootURL}assets/ember-phone-input/scripts/utils.js`)

    return doLoadJquery
      .then(() => Promise.all([doLoadScript1, doLoadScript2]))
      .then(() => {
        if (this.isDestroyed) {
          return
        }

        this.set('didLoad', true)
      })
  }
}
