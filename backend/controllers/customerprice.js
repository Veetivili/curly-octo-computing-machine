const Customer = require("../models/customer");
const Product = require("../models/product");

function getTimeOfYearDiscount() {
    const month = new Date().getMonth() + 1;  // getMonth() returns 0-11, so add 1 to get 1-12
    if (month === 12 || month === 10) {
        return 0.10;  // 10% discount for October and December
    } else if (month === 7 || month === 6) {
        return 0.05;  // 5% discount for June and July
    }
    console.log('month:', month);
    return 0;
}


async function calculateCustomerPrices(customerId, specialDeal=0) {
    try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      const timeOfYearDiscount = getTimeOfYearDiscount();
      console.log('timeOfYearDiscount:', timeOfYearDiscount);
      const specialDealDiscount = customer.special_deal || 0;
  
      const salesHistory = parseFloat(customer.sales_history);
      if (isNaN(salesHistory)) {
        throw new Error('Invalid sales history value');
      }
  
      const discount = (salesHistory > 3000 ? 0.05 : 0) + specialDeal;  // 5% discount if salesHistory > 3000
  
      const products = await Product.find();
      const discountedPrices = {};
      products.forEach(product => {
        // Check if listing_price is a valid number
        if (typeof product.listing_price !== 'number' || isNaN(product.listing_price)) {
          throw new Error('Invalid product listing price');
        }
        
        const totalDiscount = discount + timeOfYearDiscount + specialDealDiscount;
        const discountedPrice = product.listing_price * (1 - totalDiscount);
        discountedPrices[product._id] = discountedPrice.toFixed(2);  // format to 2 decimal places and assign to the discountedPrices object
      });
  
      return discountedPrices;
    } catch (error) {
      console.error('Error calculating customer prices:', error.message);
      throw error;  // Error to be handled in the router
    }
  }

    module.exports = calculateCustomerPrices;