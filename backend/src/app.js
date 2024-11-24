const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');

const { signup,login } = require('./controllers/auth.controller'); 
const {addUser,updateUser,deleteUser,listUsers} = require('./controllers/users.controller');
const {authMiddleware,adminMiddleware} = require("./middlewares/auth.middleware")
const bodyParser = require('body-parser');
const CartController = require('./controllers/cart.controller');
const OrderController = require('./controllers/order.controller');
const ProductController = require('./controllers/product.controller');
const ErrorHandler = require('./utils/error.handler');
const cors = require('cors');

const app = express();
app.use(cors());
connectDB();
app.use(express.json());


/*All routes*/
app.post("/api/auth/signup",signup)
app.post('/api/auth/login', login);

//users
app.post('/api/user/add_user', authMiddleware, adminMiddleware, addUser);
app.put('/api/user/update_user/:id', updateUser);
app.delete('/api/user/delete_user/:id', authMiddleware, adminMiddleware, deleteUser);
app.post('/api/user/listing', authMiddleware, adminMiddleware, listUsers);

//Products
app.post('/api/product/add_product', authMiddleware, adminMiddleware, ProductController.createProduct);             
app.put('/api/product/update_product/:id', authMiddleware, adminMiddleware, ProductController.updateProduct);    
app.delete('/api/product/delete_product/:id', authMiddleware, adminMiddleware, ProductController.deleteProduct);
app.post('/api/product/listing',ProductController.listProducts); 

app.get('/api/cart/:userId', CartController.getCart.bind(CartController));
app.post('/api/checkout', (req, res) => OrderController.checkout(req, res));
app.post('/api/cart', CartController.createCart.bind(CartController));

app.use((err, req, res, next) => ErrorHandler.handleError(err, req, res, next));


module.exports = app;
