// app/routes/customers/id.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CustomersIdRoute extends Route {
  @service store;
  @service productData;

  async model(params) {
    let customer = await this.store.findRecord('customer', params.id);
    let products = await this.productData.fetchProducts();
    return { customer, products };
  }
  
}
