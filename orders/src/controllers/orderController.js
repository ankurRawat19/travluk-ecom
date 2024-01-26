const Order = require("../models/order");
const orderService = require("../services/orderService");

class OrderController{
    async getOrders(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({message: "Server error"});
        }
    }

    async getOrderById(req, res, next) {
        try {
            const {orderId} = req.params;
            const order = await orderService.getOrder(orderId);
            if (!order) {
                return res.status(404).json({error: 'order not found'});
            }
            res.status(200).json(order);
        } catch (error) {
            console.error("Error retrieving order:", error);
            res.status(500).json({message: "Server error"});
        }
    }
    async updateOrderById(req, res, next){
        try {
            const { orderId } = req.params;
            const updatedValues = req.body;
            const updatedOrder = await orderService.updateOrder(orderId,updatedValues);
            if (!updatedOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async getOrderStatusHistory(req, res, next) {
        try {
            const { orderId } = req.params;
            const statusHistory = await orderService.getOrderStatusHistory(orderId);
            res.status(200).json(statusHistory);
        } catch (error) {
            console.error('Error retrieving order status history:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async updateOrderStatus(req, res, next){
        try {
            const { orderId } = req.params;
            const updatedStatus = req.body;
            const updatedOrderStatus = await orderService.updateOrderStatus(orderId,updatedStatus);
            if (!updatedOrderStatus) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.json(updatedOrderStatus);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


}

module.exports = OrderController
