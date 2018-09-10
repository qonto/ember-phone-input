import Component from '@ember/component'

export default Component.extend({
  actions: {
    // BEGIN-SNIPPET phone-input-action-handling.js
    handleUpdate(number, metaData) {
      this.set('number', number)
      this.setProperties(metaData)
    }
    // END-SNIPPET
  }
})

// import Controller from '@ember/controller'
// import { action } from '@ember-decorators/object'

// export default class DocsUsageController extends Controller {
//   @action
//   handleUpdate(number, metaData) {
//     this.set('number', number)
//     this.setProperties(metaData)
//   }
// }
