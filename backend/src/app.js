const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');
const { signup } = require('./controllers/auth.controller'); 
const app = express();

connectDB();
app.use(express.json());
app.post("/api/auth/signup",signup)

module.exports = app;
