const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Import database connection
const db = require('./database/db');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middlweware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Import Routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/product');
const customerRoute = require('./routes/customer');

// Route Middlewares
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/customers', customerRoute);

// Server
var server = app.listen(process.env.PORT, () => {
    try {
        db
        console.log(`Server running on port ${process.env.PORT}`);
    } catch (error) {
        console.log(error);
    }
});

server;
// While running tests, we need to close the server for jest to exit properly
//server.close();

module.exports = app;