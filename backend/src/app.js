const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');

const { signup,login } = require('./controllers/auth.controller'); 
const {addUser,updateUser,deleteUser,listUsers,getUser} = require('./controllers/users.controller');
const {authMiddleware,adminMiddleware} = require("./middlewares/auth.middleware")
const bodyParser = require('body-parser');
const CartController = require('./controllers/cart.controller');
const OrderController = require('./controllers/order.controller');
const ProductController = require('./controllers/product.controller');
const ErrorHandler = require('./utils/error.handler');
const cors = require('cors');

const app = express();
connectDB();
app.use(express.json());

app.use(cors());

/*All routes*/
app.post("/api/auth/signup",signup)
app.post('/api/auth/login', login);

//users
app.post('/api/user/add_user', authMiddleware, adminMiddleware, addUser);
app.put('/api/user/update_user/:id',authMiddleware, updateUser);
app.delete('/api/user/delete_user/:id', authMiddleware, adminMiddleware, deleteUser);
app.post('/api/user/listing', authMiddleware, adminMiddleware, listUsers);
app.put('/api/user/:id', getUser); 

//Products
app.post('/api/product/add_product', authMiddleware, adminMiddleware, ProductController.createProduct);             
app.put('/api/product/update_product/:id', authMiddleware, adminMiddleware, ProductController.updateProduct);    
app.delete('/api/product/delete_product/:id', authMiddleware, adminMiddleware, ProductController.deleteProduct);
app.post('/api/product/listing',ProductController.listProducts);
app.get('/api/product/sync_reviews', ProductController.fillReviews);
app.get('/api/product/:productId', ProductController.getProduct); 

//Cart
app.get('/api/cart/:userId', CartController.getCart.bind(CartController));
app.post('/api/cart', CartController.createCart.bind(CartController));
app.put('/api/cart/update/:userId', CartController.updateCart.bind(CartController));
app.delete('api/cart/clear/:userId', CartController.clearCart.bind(CartController));

//orders
app.get('/api/orders/listing',authMiddleware, adminMiddleware,OrderController.listOrders);
app.post('/api/checkout', (req, res) => OrderController.checkout(req, res));


app.use((err, req, res, next) => ErrorHandler.handleError(err, req, res, next));


module.exports = app;
