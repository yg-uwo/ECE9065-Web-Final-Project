const { signupService} = require('../services/auth.services');
const { SUCCESS_MESSAGES, ERROR_MESSAGES, REGEX } = require('../utils/constants');

// Validate
const validateInput = (data) => {
  const errors = [];
  if (!REGEX.EMAIL.test(data.email)) {
    errors.push(ERROR_MESSAGES.INVALID_EMAIL);
  }
  if (!REGEX.PASSWORD.test(data.password)) {
    errors.push(ERROR_MESSAGES.INVALID_PASSWORD);
  }
  if (data.phoneNumber && !REGEX.PHONE_NUMBER.test(data.phoneNumber)) {
    errors.push(ERROR_MESSAGES.INVALID_PHONE);
  }
  return errors;
};

// Signup API
exports.signup = async (req, res) => {
  try {
    const errors = validateInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { first_name,last_name, email, password, phoneNumber, role } = req.body;
    await signupService({ first_name,last_name, email, password, phoneNumber, role });

    res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

