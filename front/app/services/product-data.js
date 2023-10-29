// app/services/product-data.js
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ProductDataService extends Service {
  @tracked products = [];
  @tracked discountMetadata = null;

  async applyDiscounts(customerId, discountSelections) {
    try {
      let response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerId, discountSelections }),
      });
      if (!response.ok) {
        throw new Error(`Failed to apply discounts: ${response.statusText}`);
      }
      let responseData = await response.json();
      this.products = responseData.data.map(product => product.attributes);

      if (responseData.meta) {
        this.discountMetadata = responseData.meta;
      }

      return this.products;
    } catch (error) {
      console.error('Error applying discounts:', error);
      throw error;
    }
  }
}

