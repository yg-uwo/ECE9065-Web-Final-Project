const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');
const bodyParser = require('body-parser');
const CartController = require('./controllers/cart.controller');
const OrderController = require('./controllers/order.controller');
const ErrorHandler = require('./utils/error.handler');

const app = express();

connectDB();
app.use(express.json());

// Routes
app.get('/api/cart/:userId', CartController.getCart.bind(CartController));
app.post('/api/checkout', (req, res) => OrderController.checkout(req, res));
app.post('/api/cart', CartController.createCart.bind(CartController));
// app.post('/api/cart', async (req, res) => {
//     const { userId, items } = req.body;
//     try {
//         console.log(userId, items);
//         const cart = await CartController.createCart(req.body);
//         res.status(201).json(cart);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating cart', error });
//     }
// })

app.use((err, req, res, next) => ErrorHandler.handleError(err, req, res, next));

module.exports = app;
