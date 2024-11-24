const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');
const { signup,login } = require('./controllers/auth.controller'); 
const {addUser} = require('./controllers/users.controller');
const app = express();

connectDB();
app.use(express.json());

//All routes
app.post("/api/auth/signup",signup)
app.post('/api/auth/login', login);
app.post('/api/auth/add_user', addUser);

module.exports = app;
