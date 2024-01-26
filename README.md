# travluk-ecom
Backend of EcommerceApp in Nodejs using microservices

Installation : 
  1. git clone this repo.
  2. run npm i in all directories.
  3. run node index.js in all directories.
  4. you can access all the servies from either api-gateway's proxy or from each service host as well.

ScreenShots : 
  Screenshots of all routes have been uploaded in screenshots directory.

Below is the archtecture design for the microservices

-> api-GateWay: 
    This srvice sets up an API Gateway using Express, which acts as a reverse proxy to route requests to different         backend services based on the specified paths

-> Customer Service : 

1. API Design:

    Endpoints:
        POST /reister: Register a new customer.
        POST /login: Login a customer.
        PUT /:customerId: Update customer profile.
        GET /customers/:customerId: Retrieve customer details.
        GET /home : Opens home page for authenticated cutomers.

2. Authentication and Authorization : done using JWT

3. Database:

    Choice: MongoDB or PostgreSQL for structured customer data.
    Schema:
      const customerSchema = {
      name: String,
      email: String,
      password: String,
      address: String,
      };
4. Business Logic:
    Uses Redis for caching logged in users to increase performance.

5. Scalability and Performance:
    Scaling: Vertical scaling based on the number of customers.
    Optimization: Indexing for faster customer data retrieval and caching using Redis.

-> Product Service:

1. API Design:

    Endpoints:
        POST /api/products: Add a new product.
        PUT /api/products/:productId: Update product details.
        GET /api/products/:productId: Retrieve product details.
        DELETE /api/products/:productId: Delete a product.
        POST /api/products/buy : Buys a product
        GET /api/products : Retrieves all products

2. Communication:
    Interacts with Orders Service to for processing of order and order confirmation using RabbitMQ (Product and Order       queues).

3. Database:
    Choice: MongoDB for flexibility in handling JSON-like data.
    Schema:
      const productSchema = {
        name: String,
        description: String,
        price: Number,
        stock: Number,
      };
   
4. Business Logic:
    Uses RabbitMQ message queues for asynchronous processes and Adjusts stock levels upon order confirmation.

5. Scalability:
    Scaling: Horizontal scaling based on increased product data.

-> Order Service: 

1. API Design:

    Endpoints:
        GET /api/orders: Get all orders.
        GET /api/orders/:orderId: Retrieve specific order details.
        GET /api/orders/status/:orderId: Retrieve order status history
        PUT /api/orders/status/:orderId: updates order status history
        PUT /api/orders/:orderId: updates specific order details.

2. Database:
    Choice: MongoDB or MySQL (for relational order data).
    Schema:
      const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to the 'Customer' model
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Reference to the 'Product' model
        required: true,
    }],
    quantity: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    statusHistory: [
        {
            status: String,
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],

})

3. Communication:
    Interacts with Products Service to for processing of order and order confirmation using RabbitMQ (Product and           Order queues).

4. Scalability :
    Scaling: Horizontal scaling based on the number of orders.

-> Microservices Communication:
    Uses RESTful APIs for synchronous communication.
    Message queues (e.g., RabbitMQ) for asynchronous processes like order confirmation.

-> Assumptions and Design Decisions:
    Assumption: Product and Customer services don't need direct communication, Product and Order service need to communicate with each other so used amqplib library.
