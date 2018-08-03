import Component from '@ember/component'

export default Component.extend({
  actions: {
    // BEGIN-SNIPPET intl-tel-input-action-handling.js
    handleUpdate(number, metaData) {
      this.set('number', number)
      this.setProperties(metaData)
    }
    // END-SNIPPET
  }
})
