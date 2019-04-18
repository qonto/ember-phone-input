import Controller from '@ember/controller'

export default Controller.extend({
  number: '',

  actions: {
    handleUpdate() {
      console.log('handle update')
    }
  }
})
