const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');
const { signup,login } = require('./controllers/auth.controller'); 
const app = express();

connectDB();
app.use(express.json());

//All routes
app.post("/api/auth/signup",signup)
app.post('/api/auth/login', login);


module.exports = app;
