import Service from '@ember/service'
import { resolve } from 'rsvp'
import loadScript from 'ember-intl-tel-input/utils/load-script'
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

    let doLoad = shouldLoad ? loadScript('/scripts/') : resolve()

    return doLoad.then(() => {
      this.set('didLoad', true)
    })
  }
}
