const express = require("express");
const ProductController = require("../controllers/productController");
const isAuthenticated = require("../middlewares/isAuthenticated");

const router = express.Router();
const productController = new ProductController();

//create a new product
router.post("/", isAuthenticated, (req,res) => productController.createProduct(req,res));

//buy products
router.post("/buy", isAuthenticated, (req, res, next) => productController.createOrder(req,res,next));

//get all products
router.get("/", isAuthenticated, (req, res, next) => productController.getProducts(req,res,next));

//get product by id
router.get("/:productId", isAuthenticated, (req, res, next) => productController.getProductById(req,res,next));

//update product by id
router.put("/:productId",isAuthenticated,(req, res, next) => productController.updateProductById(req,res,next))

//delete product by id
router.delete("/:productId",isAuthenticated,(req, res, next) => productController.deleteProductById(req,res,next))


module.exports = router;