import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DocsBugsCallstack extends Controller {
  @tracked currentPhoneNumber = '+33';

  @action
  handleUpdatePhoneNumber(value) {
    this.currentPhoneNumber = value;
  }
}
