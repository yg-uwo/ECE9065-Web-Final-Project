const express = require('express');
const { signup, login } = require('../controllers/auth.controller');
// const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();
console.log("hduheduhe")
router.post('/signup', signup);


module.exports = router;
