import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  phoneInput: service(),

  async beforeModel() {
    await this.get('phoneInput').load()
  }
})
