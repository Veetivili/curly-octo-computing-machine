// app/routes/customers/id.js
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class CustomersIdRoute extends Route {
  @service store;
  @service productData;

  async model(params) {
    let customer = await this.store.findRecord('customer', params.id);
    if (customer) {
      let products = await this.productData.fetchProducts(params.id);
      return { customer, products };
    }
  }

  @action
  async applySpecialDeal() {
    let specialDeal = document.getElementById('specialDeal').value;
    let customerId = this.modelFor(this.routeName).customer.id;
    try {
      let response = await fetch('http://localhost:3000/api/products/apply-special-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ specialDeal, customerId })
      });
      if (!response.ok) {
        throw new Error(`Failed to apply special deal: ${response.statusText}`);
      }
      let responseData = await response.json();
      this.productData.products = responseData.data.map(product => product.attributes);
    } catch (error) {
      console.error('Error applying special deal:', error);
    }
  }
}
