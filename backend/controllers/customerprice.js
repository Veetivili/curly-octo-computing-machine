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


async function calculateCustomerPrices(customerId, discountSelections = {}) {
  try {
      const customer = await Customer.findById(customerId);
      if (!customer) {
          throw new Error('Customer not found');
      }

      // Parse the special deal discount, or default to 0 if not provided or invalid
    const specialDealDiscount = parseFloat(discountSelections.specialDeal) || 0;

    // Determine time of year discount based on discountSelections, or default to 0 if not selected
    const timeOfYearDiscount = discountSelections.timeOfYear ? getTimeOfYearDiscount() : 0;

    // Determine sales history discount based on discountSelections and sales history, or default to 0 if not selected
    const salesHistory = parseFloat(customer.sales_history);
    const salesHistoryDiscount = discountSelections.salesHistory && salesHistory > 3000 ? 0.05 : 0;

    // Calculate the total discount
    const totalDiscount = specialDealDiscount + timeOfYearDiscount + salesHistoryDiscount;

    // Convert discounts from decimal to percentage
    const salesHistoryDiscountPercent = salesHistoryDiscount * 100;
    const timeOfYearDiscountPercent = timeOfYearDiscount * 100;
    const specialDealDiscountPercent = specialDealDiscount * 100;
    const totalDiscountPercent = totalDiscount * 100;

      const products = await Product.find();
      const discountedPrices = {};
      products.forEach(product => {
        
          // Check if listing_price is a valid number
          if (typeof product.listing_price !== 'number' || isNaN(product.listing_price)) {
              throw new Error('Invalid product listing price');
          }

          const discountedPrice = product.listing_price * (1 - totalDiscount);
          discountedPrices[product._id] = discountedPrice.toFixed(2);  // format to 2 decimal places and assign to the discountedPrices object
      });

      return {
        discountedPrices,
        discountDetails: {
          salesHistoryDiscount: salesHistoryDiscountPercent.toFixed(2),
          timeOfYearDiscount: timeOfYearDiscountPercent.toFixed(2),
          specialDealDiscount: specialDealDiscountPercent.toFixed(2),
          totalDiscount: totalDiscountPercent.toFixed(2),
        }
      };
  } catch (error) {
      console.error('Error calculating customer prices:', error.message);
      throw error;  // Error to be handled in the router
  }
}

module.exports = calculateCustomerPrices;
