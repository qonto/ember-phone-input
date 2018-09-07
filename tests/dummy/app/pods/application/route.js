import Route from '@ember/routing/route'
import { service } from '@ember-decorators/service'

export default class ApplicationRoute extends Route {
  @service phoneInput

  async model() {
    await this.get('phoneInput').load()
  }
}
