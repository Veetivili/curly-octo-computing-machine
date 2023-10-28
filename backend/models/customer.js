const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const customerSchema = new mongoose.Schema({
    company: String,
    contact_person: String,
    sales_history: Number,
    special_deal: Number,
});

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
