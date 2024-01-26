const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("redis");
const util = require("util");
const CustomerRepository = require("../repositories/customerRepository");
const config = require("../configuration/config");
const Customer = require("../models/customer");

const redisClient = redis.createClient();

    redisClient.on('error', err => console.log('Redis Client Error', err))
        .connect().then( r => {
        console.log("connected to redis")
    });

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    async findUserByUserID(userid) {
        const user = await Customer.findById(userid);
        return user;
    }

    async findUserByUsername(username) {
        try {
            const existingUser = await Customer.findOne({ username });
            return existingUser;
        } catch (error) {
            console.error("Error finding user by username:", error.message);
            throw error;
        }
    }

    async updateCustomerById(customerId,updatedUser){
        try{
            const user = await Customer.findByIdAndUpdate(customerId,updatedUser,{new:true})
            return user;
        }catch (e){
            console.log(e)
        }
    }
    async login(username, password) {
        try {
            // Check if user exists in cache
            const cachedUser = await redisClient.get(username);
            if (cachedUser) {
                const user = JSON.parse(cachedUser);
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    const token = jwt.sign({ id: user._id }, config.jwtSecret);
                    return { success: true, token, fromCache: true };
                }
            }

            // If not in cache, fetch from the database
            const user = await this.customerRepository.getCustomerByUsername(username);

            if (!user) {
                throw new Error("Invalid username or password");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error("Invalid username or password");
            }

            // Store user in cache for some duration
            await redisClient.setEx(username,3600, JSON.stringify(user));

            const token = jwt.sign({ id: user._id }, config.jwtSecret);

            return { success: true, token, fromCache: false };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
    async register(user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        // Clear user from cache on registration
        await redisClient.del(user.username);

        return await this.customerRepository.createCustomer(user);
    }
}

module.exports = CustomerService;
