const express = require("express");
const router = express.Router();

const Product = require("../models/product");

const calculateCustomerPrices = require("../controllers/customerprice");

router.post("/", async (req, res) => {
    try {
        const { specialDeal, customerId, discountSelections } = req.body;
        if (!customerId) {
            throw new Error('Missing required parameters');
        }
    
        const { discountedPrices, discountDetails } = await calculateCustomerPrices(customerId, { specialDeal, ...discountSelections });

      const products = await Product.find();
      const formattedProducts = products.map((product) => {
          const price = discountedPrices[product._id] || product.listing_price;
          return {
              id: product._id,
              type: "product",
              attributes: {
                  name: product.name,
                  description: product.description,
                  price,
                  original_price: product.listing_price, 
              },
          };
      });
      console.log(specialDeal);
      console.log('formattedProducts:', formattedProducts[1]);
      res.status(200).json({
          data: formattedProducts,
          meta: {
              total: formattedProducts.length,
              ...discountDetails
          },
      });

  } catch (err) {
      res.status(500).json({
          errors: [
              {
                  title: "Internal Server Error",
                  detail: err.message,
              },
          ],
      });
  }
});

module.exports = router;