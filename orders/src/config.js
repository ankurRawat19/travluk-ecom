require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3002,
    jwtSecret: process.env.JWT_SECRET || "jwtSecretKey",
    mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost:27017/order-service',
    rabbitMQURI: process.env.RABBITMQ_URI || "amqp://localhost",
    rabbitMQQueue: 'orders',

};