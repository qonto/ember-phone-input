import Service from '@ember/service'
import loadScript from 'ember-intl-tel-input/utils/load-script'
import RSVP from 'rsvp'
import { reads } from '@ember-decorators/object/computed'
import { service } from '@ember-decorators/service'

export default class PhoneInputService extends Service {
  @service config

  didLoad = this.didLoad || false

  @reads("config['ember-phone-input'].lazyLoad") lazyLoad

  init() {
    super.init(...arguments)

    if (!this.lazyLoad) {
      this.load()
    }
  }

  load() {
    const { lazyLoad: shouldLoad } = this

    const doLoadScript1 = shouldLoad
      ? loadScript('/assets/ember-phone-input/scripts/intlTelInput.min.js')
      : RSVP.resolve()

    const doLoadScript2 = shouldLoad
      ? loadScript('/assets/ember-phone-input/scripts/utils.js')
      : RSVP.resolve()

    return RSVP.all([doLoadScript1, doLoadScript2]).then(() => {
      this.set('didLoad', true)
    })
  }
}
