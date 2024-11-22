const express = require('express');
const connectDB = require('./config/db');
const env = require('./config/env');

const app = express();

connectDB();
app.use(express.json());


module.exports = app;
