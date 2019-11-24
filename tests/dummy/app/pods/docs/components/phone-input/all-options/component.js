import Component from '@ember/component';

export default Component.extend({
  allowDropdownNumber: null,
  number: null,
  separateDialNumber: null,

  actions: {
    handleUpdate(number, metaData) {
      this.set('number', number);
      this.setProperties(metaData);
    },

    updateAllowDropdownNumber(allowDropdownNumber) {
      this.set('allowDropdownNumber', allowDropdownNumber);
    },

    updateSeparateDialOption(separateDialNumber, metaData) {
      this.set('separateDialNumber', separateDialNumber);
      this.setProperties(metaData);
    }
  }
});
