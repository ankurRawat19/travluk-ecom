const Product = require("../models/product");
const messageBroker = require("../utils/messageBroker");
const uuid = require('uuid');
const productService = require("../services/productsService");
class ProductController {

    constructor() {
        this.ordersMap = new Map();

    }

    async createProduct(req, res, next) {
        try {
            const productData = req.body
            const newProduct = await productService.addProduct(productData);
            res.status(201).json(newProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async createOrder(req, res, next) {
        try {
            const { ids,quantity } = req.body;
            const products = await Product.find({ _id: { $in: ids } });
            const orderId = uuid.v4(); // Generate a unique order ID
            this.ordersMap.set(orderId, {
                status: "pending",
                products,
                userid: req.user.id
            });

            await messageBroker.publishMessage("orders", {
                products,
                quantity,
                customerId: req.user.id,
                orderId,
            });

            await messageBroker.consumeMessage("products", (data) => {
                const orderData = JSON.parse(JSON.stringify(data));
                const {orderId} = orderData;
                const order = this.ordersMap.get(orderId);
                if (order) {
                    this.ordersMap.set(orderId, {...order, ...orderData, status: 'completed'});
                }
            });

            // Adjust stock levels in the Products microservice
            await productService.adjustStockLevels(products,quantity);

            // Long polling until order is completed
            let order = this.ordersMap.get(orderId);
            while (order.status !== 'completed') {
                await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second before checking status again
                order = this.ordersMap.get(orderId);
            }

            // Once the order is marked as completed, return the complete order details
            return res.status(200).json({message : "order placed successfully ..." ,order});
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }


    async getProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async getProductById(req, res, next) {
        try {
            const { productId } = req.params;
            const product = await productService.getProduct(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.status(200).json(product);
        } catch (error) {
            console.error("Error retrieving product:", error);
            res.status(500).json({ message: "Server error" });
        }
    }

    async updateProductById(req, res, next){
        try {
            const { productId } = req.params;
            const updatedValues = req.body;
            const updatedProduct = await productService.updateProduct(productId,updatedValues);
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }
            res.json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deleteProductById(req,res){
        try {
            const { productId } = req.params;
           const deletedProduct = await productService.deleteProduct(productId);
            res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
        } catch (error) {
            console.error("Error deleting product:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = ProductController;