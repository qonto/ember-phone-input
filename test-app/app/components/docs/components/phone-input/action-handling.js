import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ActionHandlingComponent extends Component {
  @tracked number;
  @tracked metaData;

  @action
  // BEGIN-SNIPPET phone-input-action-handling.js
  handleUpdate(number, metaData) {
    this.number = number;
    this.metaData = metaData;
  }
  // END-SNIPPET
}
