/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components, ember/no-actions-hash */
import Component from '@ember/component';

export default Component.extend({
  actions: {
    // BEGIN-SNIPPET phone-input-action-handling.js
    handleUpdate(number, metaData) {
      this.set('number', number);
      this.setProperties(metaData);
    }
    // END-SNIPPET
  }
});
