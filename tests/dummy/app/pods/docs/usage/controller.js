import Controller from '@ember/controller'
import { action } from '@ember-decorators/object'

export default class DocsUsageController extends Controller {
  @action
  handleUpdate(number, metaData) {
    this.set('number', number)
    this.setProperties(metaData)
  }
}
