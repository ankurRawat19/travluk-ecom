const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const MessageBroker = require("./utils/messageBroker");
const productsRouter = require("./routes/productRoutes");
require("dotenv").config();

class App {
    constructor() {
        this.app = express();
        this.connectMongoDB();
        this.setMiddlewares();
        this.setRoutes();
        this.setupMessageBroker();
    }

    async connectMongoDB() {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => console.log('MongoDB Connected!')).catch(() => console.log("Some error occurred while connecting to Database"));
    }

    async disconnectDB() {
        await mongoose.disconnect();
        console.log("MongoDB disconnected");
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    setRoutes() {
        this.app.use("/api/products", productsRouter);
    }

    setupMessageBroker() {
        MessageBroker.connect();
    }

    start() {
        this.server = this.app.listen(3001, () =>
            console.log("Server started on port 3001")
        );
    }

    async stop() {
        await mongoose.disconnect();
        this.server.close();
        console.log("Server stopped");
    }
}

module.exports = App;