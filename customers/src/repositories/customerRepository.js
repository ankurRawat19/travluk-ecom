const customer = require("../models/customer");

/**
 * Class to encapsulate the logic for the user repository
 */
class CustomerRepository {
    async createCustomer(user) {
        return await customer.create(user);
    }

    async getCustomerByUsername(username) {
        return await customer.findOne({ username });
    }
}

module.exports = CustomerRepository;