const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the 'Customer' model
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the 'Product' model
        required: true,
    }],
    quantity: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    statusHistory: [
        {
            status: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
}, { collection: 'orders' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;