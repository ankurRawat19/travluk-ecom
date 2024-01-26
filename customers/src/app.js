const express = require("express");
const mongoose = require("mongoose");
const config = require("./configuration/config");
const isAuthenticated = require("./middlewares/isAuthenticated");
const CustomerController = require("./controllers/customerController");
const helmet = require('helmet');
const morgan = require('morgan');

class App {
    constructor() {
        this.app = express();
        this.customerController = new CustomerController();
        this.connectMongoDB();
        this.setupMiddlewares();
        this.setupRoutes();
        this.setErrorHandlers();
    }
    async connectMongoDB() {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: 10, // connection pool size
        }).then(() => console.log('MongoDB Connected!')).catch(() => console.log("Some error occurred while connecting to Database"));
    }

    setupMiddlewares() {
        this.app.use(helmet());
        this.app.use(morgan('combined'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    setupRoutes() {
        this.app.post("/login", (req, res) => this.customerController.login(req, res));
        this.app.post("/register", (req, res) => this.customerController.register(req, res));
        this.app.get("/home", isAuthenticated, (req, res) => res.json({ message: "Welcome to Home" }));
        this.app.get("/details", isAuthenticated, (req, res) => this.customerController.getProfile(req, res));
        this.app.put('/update', isAuthenticated, (req, res) => this.customerController.updateProfile(req, res));
    }

    setErrorHandlers() {
        // Global error handling middleware
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({ message: 'Internal Server Error' });
        });
    }

    start() {
        this.server = this.app.listen(3000, () => console.log("Server started on port 3000"));
    }

    async stop() {
        await mongoose.disconnect();
        this.server.close();
        console.log("Server stopped");
    }
}

module.exports = App;