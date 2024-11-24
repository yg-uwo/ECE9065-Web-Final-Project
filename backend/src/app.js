const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');
const { signup,login } = require('./controllers/auth.controller'); 
const {addUser} = require('./controllers/users.controller');
const {authMiddleware,adminMiddleware} = require("./middlewares/auth.middleware")
const app = express();

connectDB();
app.use(express.json());

//All routes
app.post("/api/auth/signup",signup)
app.post('/api/auth/login', login);
app.post('/api/user/add-user', authMiddleware, adminMiddleware, addUser);

module.exports = app;
