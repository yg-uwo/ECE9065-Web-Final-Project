const jwt = require('jsonwebtoken');
const { ERROR_MESSAGES } = require('../utils/constants');
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }

  try {
    //adding user details in request
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); //it will trigger adminMiddleware 
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: ERROR_MESSAGES.UNAUTHORIZED_ACCESS });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
