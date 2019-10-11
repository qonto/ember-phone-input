import Component from '@ember/component'

export default Component.extend({
  allowDropdown: null,
  number: null,
  separateDialNumber: null,

  actions: {
    handleUpdate(number, metaData) {
      this.set('number', number)
      this.setProperties(metaData)
    },

    updateSeparateDialOption(separateDialNumber, metaData) {
      this.set('separateDialNumber', separateDialNumber)
      this.setProperties(metaData)
    }
  }
})
