const Order = require("../models/order")

class OrderService{

    async getAllOrders() {
        try {
            const orders = await Order.find({});

            if (!orders) {
                throw { status: 404, message: "No order found" };
            }

            return orders;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async getOrder(orderId) {
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                throw { status: 404, message: "Order not found" };
            }

            return order;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async updateOrder(orderId, updates) {
        try {
            // Validate updates
            if (updates.quantity < 0) {
                throw { status: 400, message: "Invalid Quantity" };
            }
            const updatedOrder = await Order.findByIdAndUpdate(orderId, updates, { new: true });

            if (!updatedOrder) {
                throw { status: 404, message: "Order not found" };
            }

            return updatedOrder;
        } catch (error) {
            throw { status: error.status || 500, message: error.message || "Internal Server Error" };
        }
    }

    async updateOrderStatus(orderId, newStatus) {
        try {
            const order = await Order.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }
            // Update the current status
            order.status = newStatus.status;

            // Add a new entry to the statusHistory array
            order.statusHistory.push({
                status: newStatus.status,
            });
            await order.save();
            return order;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }

    async getOrderStatusHistory(orderId) {
        try {
            const order = await Order.findById(orderId);

            if (!order) {
                throw new Error('Order not found');
            }

            return order.statusHistory;
        } catch (error) {
            console.error('Error retrieving order status history:', error);
            throw error;
        }
    }

}

module.exports = new OrderService()