const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const AppError = require('../utils/error');
const { ERROR_MESSAGES, ROLES } = require('../utils/constants');

// Signup Service
exports.signupService = async ({ first_name,last_name, email, password,phoneNumber, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(ERROR_MESSAGES.USER_ALREADY_EXISTS, 400);
  }

  // if (role && role !== ROLES.GENERAL) {
  //   throw new AppError(ERROR_MESSAGES.UNAUTHORIZED_ACCESS, 403);
  // }

  const user = new User({ first_name,last_name, email, password,phoneNumber, role });
  await user.save();
  return user;
};

//login service
exports.loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
  }

  const ispasswordMatch = await bcrypt.compare(password, user.password);
  if (!ispasswordMatch) {
    throw new AppError(ERROR_MESSAGES.INCORRECT_PASSWORD, 400);
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { token, role: user.role };
};


