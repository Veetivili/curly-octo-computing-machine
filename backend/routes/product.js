const express = require("express");
const router = express.Router();

const Product = require("../models/product");

const calculateCustomerPrices = require("../controllers/customerprice");

router.post("/", async (req, res) => {
  try {
    const { customerId } = req.body;
    const customerSpecificPrices = await calculateCustomerPrices(customerId);

    const products = await Product.find();
    const formattedProducts = products.map((product) => {
        const price = customerSpecificPrices[product._id] || product.listing_price;
        return {
            id: product._id,
            type: "product",
            attributes: {
                name: product.name,
                description: product.description,
                price,  // Use the customer-specific price, or the listing price if not available
            },
        };
    });
    console.log('formattedProducts:', formattedProducts[1]);
    res.status(200).json({
        data: formattedProducts,
        meta: {
            total: formattedProducts.length,
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

router.post("/apply-special-deal", async (req, res) => {
  try {
      const { specialDeal, customerId } = req.body;
      if (!specialDeal || !customerId) {
          throw new Error('Missing required parameters');
      }

      const customerSpecificPrices = await calculateCustomerPrices(customerId, specialDeal);

      const products = await Product.find();
      const formattedProducts = products.map((product) => {
          const price = customerSpecificPrices[product._id] || product.listing_price;
          return {
              id: product._id,
              type: "product",
              attributes: {
                  name: product.name,
                  description: product.description,
                  price,  // Use the customer-specific price, or the listing price if not available
              },
          };
      });

      res.status(200).json({
          data: formattedProducts,
          meta: {
              total: formattedProducts.length,
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
