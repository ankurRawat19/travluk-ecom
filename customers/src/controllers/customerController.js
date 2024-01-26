const CustomerService = require("../services/CustomerService");

class CustomerController {
    constructor() {
        this.customerService = new CustomerService();
    }

    async login(req, res) {
        const { username, password } = req.body;

        const result = await this.customerService.login(username, password);

        if (result.success) {
            res.json({ token: result.token });
        } else {
            res.status(400).json({ message: result.message });
        }
    }

    async register(req, res) {
        const user = req.body;

        try {
            const existingUser = await this.customerService.findUserByUsername(user.username);

            if (existingUser) {
                console.log("Username already taken")
                throw new Error("Username already taken");
            }

            const result = await this.customerService.register(user);
            res.json(result);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async getProfile(req, res) {
        const userId = req.user.id;

        try {
            const customer = await this.customerService.findUserByUserID(userId);
            const sanitizedCustomer = {
                _id: customer._id,
                username: customer.username,
                email:customer.email,
                phone:customer.phone
            };

            res.json(sanitizedCustomer);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const customerId = req.user.id;
            const updates = req.body;

            const customer = await this.customerService.updateCustomerById(customerId, updates);

            // Ensure that sensitive information like the password is not sent to the client
            const sanitizedCustomer = {
                _id: customer._id,
                username: customer.username,
                // Add other non-sensitive fields if needed
            };

            res.json(sanitizedCustomer);
        } catch (error) {
            console.error('Error updating customer profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = CustomerController;