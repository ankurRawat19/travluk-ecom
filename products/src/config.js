require("dotenv").config();

module.exports = {
    port: process.env.PORT || 3001,
    jwtSecret: process.env.JWT_SECRET || "jwtSecretKey",
    mongoURI: process.env.MONGODB_PRODUCT_URI || "mongodb://localhost:27017/product-service",
    rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
    exchangeName: "products",
    queueName: "products_queue",
};