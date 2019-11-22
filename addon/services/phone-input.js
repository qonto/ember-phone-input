import Service from '@ember/service'
import { getOwner } from '@ember/application'
import RSVP from 'rsvp'

export default Service.extend({
  intlTelInput: null,

  init() {
    this._super(...arguments)

    const config = getOwner(this).resolveRegistration('config:environment')
    const { lazyLoad } = config.phoneInput

    if (!lazyLoad) {
      // if lazyLoad is disabled, load them now
      // that is to say at the app boot
      this.load()
    }
  },

  load() {
    if (this.intlTelInput) return

    return RSVP.all([
      import('intl-tel-input/build/js/intlTelInput.js'),
      import('intl-tel-input/build/js/utils.js')
    ]).then(([intlTelInput]) => {
      if (!this.isDestroying && !this.isDestroyed) {
        this.set('intlTelInput', intlTelInput.default)
      }
    })
  }
})
