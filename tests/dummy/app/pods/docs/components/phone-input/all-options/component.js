import Component from '@ember/component'

export default Component.extend({
  actions: {
    handleUpdate(number, metaData) {
      this.set('number', number)
      this.setProperties(metaData)
    }
  }
})
