import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AllOptionsComponent extends Component {
  @tracked allowDropdownNumber;
  @tracked number;
  @tracked separateDialNumber;
  metaData = {};

  get selectedCountryData() {
    return this.metaData.selectedCountryData;
  }

  get isValidNumber() {
    return this.metaData.isValidNumber;
  }

  get extension() {
    return this.metaData.extension;
  }

  get numberFormat() {
    return this.metaData.numberFormat;
  }

  @action
  handleUpdate(number, metaData) {
    this.number = number;
    this.metaData = metaData;
  }

  @action
  updateAllowDropdownNumber(allowDropdownNumber) {
    this.allowDropdownNumber = allowDropdownNumber;
  }

  @action
  updateSeparateDialOption(separateDialNumber, metaData) {
    this.separateDialNumber = separateDialNumber;
    this.metaData = metaData;
  }

  @action
  submitForm() {
    alert('The form has been submitted');
  }
}
