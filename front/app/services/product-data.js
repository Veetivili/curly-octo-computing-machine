// app/services/product-data.js
import Service from '@ember/service';

export default class ProductDataService extends Service {
  products = [];

  async fetchProducts(customerId) {
    try {
      let response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customerId })  // Send the customerId in the request body
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      let responseData = await response.json();
      this.products = responseData.data.map(product => product.attributes);
      return this.products;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  getProducts() {
    return this.products;
  }
}
