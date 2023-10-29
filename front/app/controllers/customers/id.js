// app/controllers/customers/id.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import {inject as service} from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CustomersIdController extends Controller {
    @service productData;
    @tracked products = [];
    @tracked discountSelections = {
      timeOfYear: false,
      salesHistory: false,
      specialDealCheckbox: false,
      specialDeal: '',
    };

    @action
    async fetchProducts() {
      try {
        let customerId = this.model.customer.id;
        let products = await this.productData.fetchProducts(customerId);
        this.set('products', products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }

    @action
    updateDiscountSelections(event) {
      let {name, type, checked, value} = event.target;
      if (type === 'checkbox') {
        this.discountSelections = {
          ...this.discountSelections,
          [name]: checked
        };
      } else {
        this.discountSelections = {
          ...this.discountSelections,
          [name]: value
        };
      }
    }

    @action
  async applyDiscounts() {
    let { specialDeal, timeOfYear, salesHistory } = this.discountSelections;
    let customerId = this.model.customer.id;
    let discountSelections = { specialDeal, timeOfYear, salesHistory };
    try {
      let products = await this.productData.applyDiscounts(customerId, discountSelections);
      this.products = products;
    } catch (error) {
      console.error('Error applying discounts:', error);
    }
  }

  get discountMetadata() {
    return this.productData.discountMetadata;
  }

}


