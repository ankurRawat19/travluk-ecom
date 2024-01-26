const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    stock: { type: Number, required: true },
}, { collection : 'products' });  // Collection name explicitly set to 'products'

const Product = mongoose.model("Product", productSchema);

module.exports = Product;