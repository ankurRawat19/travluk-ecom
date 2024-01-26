const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");
const ordersRouter = require("./routes/ordersRoutes")
class App {
    constructor() {
        this.app = express();
        this.connectMongoDB();
        this.setMiddlewares();
        this.setRoutes();
        this.setupOrderConsumer();
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

    async setupOrderConsumer() {
        console.log("Connecting to RabbitMQ...");

        setTimeout(async () => {
            try {
                const amqpServer = "amqp://localhost";
                const connection = await amqp.connect(amqpServer);
                console.log("Connected to RabbitMQ");
                const channel = await connection.createChannel();
                await channel.assertQueue("orders");

                channel.consume("orders", async (data) => {
                    // Consume messages from the order queue on buy
                    console.log("Consuming ORDER service");
                    const {customerId,products,quantity,orderId} = JSON.parse(data.content);
                    const newOrder = new Order({
                        customerId,
                        products,
                        quantity,
                        status: "new",
                        totalAmount: products.reduce((acc, product) => acc + product.price, 0),
                    });

                    // Save order to DB
                    await newOrder.save();

                    // Send ACK to ORDER service
                    channel.ack(data);
                    console.log("Order saved to DB and ACK sent to ORDER queue");

                    // Send fulfilled order to PRODUCTS service
                    // Include orderId in the message
                    const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
                    channel.sendToQueue(
                        "products",
                        Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
                    );
                });
            } catch (err) {
                console.error("Failed to connect to RabbitMQ:", err.message);
            }
        }, 10000);
    }

    setMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    setRoutes() {
        this.app.use("/api/orders", ordersRouter);
    }
    async stop() {
        try {
            await this.disconnectDB()
            console.log("MongoDB disconnected");

            // Close the Express server
            if (this.server) {
                this.server.close();
                console.log("Server stopped");
            }
        } catch (error) {
            console.error("Error during shutdown:", error.message);
            process.exit(1);
        }
    }

    start() {
        this.server = this.app.listen(config.port, () =>
            console.log(`Server started on port ${config.port}`)
        );
    }
}

module.exports = App;
