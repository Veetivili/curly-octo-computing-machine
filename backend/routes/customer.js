const express = require("express");
const router = express.Router();

const Customer = require("../models/customer");

router.get("/", async (req, res) => {
    try {
        const customers = await Customer.find();
        const formattedCustomers = customers.map((customer) => {
            return {
                id: customer._id,
                type: "customer",
                attributes: {
                    company: customer.company,
                    contact_person: customer.contact_person,
                    sales_history: customer.sales_history,
                },
            };
        });
        res.status(200).json({
            data: formattedCustomers,
            meta: {
                total: formattedCustomers.length,
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
}
);

module.exports = router;