import Service from '@ember/service'
import { getOwner } from '@ember/application'
import loadScript from 'ember-phone-input/utils/load-script'
import RSVP from 'rsvp'

export default Service.extend({
  didLoad: false,

  init() {
    this._super(...arguments)

    const config = getOwner(this).resolveRegistration('config:environment')
    const { lazyLoad, hasPrepend } = config.phoneInput

    this.hasPrepend = hasPrepend

    if (!lazyLoad) {
      // if lazyLoad is disabled, load them now
      // that is to say at the app boot
      this.load()
    }
  },

  load() {
    const doLoadScript1 = this.didLoad
      ? RSVP.resolve()
      : loadScript(
          this._loadUrl('assets/ember-phone-input/scripts/intlTelInput.min.js')
        )

    const doLoadScript2 = this.didLoad
      ? RSVP.resolve()
      : loadScript(this._loadUrl('assets/ember-phone-input/scripts/utils.js'))

    return RSVP.all([doLoadScript1, doLoadScript2]).then(() => {
      if (this.isDestroyed) {
        return
      }

      this.set('didLoad', true)
    })
  },

  _loadUrl(url) {
    const { rootURL } = getOwner(this).resolveRegistration('config:environment')
    const prependUrl = this.hasPrepend ? '' : rootURL

    return `${prependUrl}${url}`
  }
})
