const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { REGEX, ERROR_MESSAGES } = require('../utils/constants');

const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'general'], default: 'general' },
  phoneNumber: {
    type: String,
    validate: {
      validator: (v) => REGEX.PHONE_NUMBER.test(v),
      message: ERROR_MESSAGES.INVALID_PHONE,
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Middleware to hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
