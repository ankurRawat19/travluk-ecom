const Product = require("../models/product");
class ProductService {
    async addProduct(productData) {
        try {
            // Validate productData
            if (!productData.name || !productData.description || !productData.price || !productData.stock) {
                throw { status: 400, message: "Invalid product data" };
            }

            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }
        async updateProduct(productId, updates) {
        try {
            // Validate updates
            if (updates.price && updates.price < 0) {
                throw { status: 400, message: "Price cannot be negative" };
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

            if (!updatedProduct) {
                throw { status: 404, message: "Product not found" };
            }

            return updatedProduct;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async getProduct(productId) {
        try {
            const product = await Product.findById(productId);

            if (!product) {
                throw { status: 404, message: "Product not found" };
            }

            return product;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async adjustStockLevels(products,quantity) {
        try {
            console.log("products : ",products)
            // Loop through each product in the order and adjust stock levels
            for (const product of products) {
                const { _id } = product;
                console.log("productId : ",_id)
                const existingProduct = await this.getProduct(_id);

                if (existingProduct) {
                    // Update the stock level in the Products microservice
                    await this.updateProduct(_id, { stock: existingProduct.stock - quantity });
                }
            }
        } catch (error) {
            console.error('Error adjusting stock levels:', error);
        }
    }

    async getAllProducts() {
        try {
            const products = await Product.find({});

            if (!products) {
                throw { status: 404, message: "No product found" };
            }

            return products;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async deleteProduct(productId) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(productId);

            if (!deletedProduct) {
                throw { status: 404, message: "Product not found" };
            }
            return deletedProduct;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }
}

module.exports = new ProductService();
