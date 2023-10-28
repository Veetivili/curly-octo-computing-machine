const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    listing_price: String,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;