const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true, // indexing username field for speeding up query performance.
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Customer", CustomerSchema);