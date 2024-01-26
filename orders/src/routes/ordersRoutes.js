const express = require("express");
const OrderController = require("../controllers/orderController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();
const orderController = new OrderController();

//get all orders
router.get("/", isAuthenticated, (req, res, next) => orderController.getOrders(req,res,next));

//get order by id
router.get("/:orderId", isAuthenticated, (req, res, next) => orderController.getOrderById(req,res,next));

//get order status by id
router.get("/status/:orderId", isAuthenticated, (req, res, next) => orderController.getOrderStatusHistory(req,res,next))

//update order by id
router.put("/:orderId",isAuthenticated,(req, res, next) => orderController.updateOrderById(req,res,next))

//update order status by id
router.put("/status/:orderId", isAuthenticated, (req, res, next) => orderController.updateOrderStatus(req,res,next))


module.exports = router;