import Service from '@ember/service';
import RSVP from 'rsvp';

export default Service.extend({
  intlTelInput: null,

  load() {
    if (this.intlTelInput) return;

    return RSVP.all([
      import('intl-tel-input/build/js/intlTelInput.js'),
      import('intl-tel-input/build/js/utils.js')
    ]).then(([intlTelInput]) => {
      if (!this.isDestroying && !this.isDestroyed) {
        this.set('intlTelInput', intlTelInput.default);
      }
    });
  }
});
