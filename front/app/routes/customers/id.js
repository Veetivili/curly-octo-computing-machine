// app/routes/customers/id.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CustomersIdRoute extends Route {
  @service store;

  async model(params) {
    try {
      return await this.store.findRecord('customer', params.id);
    } catch (error) {
      this.transition('customers');
    }
  }
}

