const express = require("express");
const router = express.Router();

const Product = require("../models/product");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    const formattedProducts = products.map((product) => {
        return {
            id: product._id,
            type: "product",
            attributes: {
                name: product.name,
                description: product.description,
                price: product.listing_price,
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