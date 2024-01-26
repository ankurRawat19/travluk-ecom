require("dotenv").config();

module.exports = {
    mongoURI: process.env.MONGODB_AUTH_URI || 'mongodb://localhost:27017/customer-service',
    jwtSecret: process.env.JWT_SECRET || "jwtSecretKey",
};