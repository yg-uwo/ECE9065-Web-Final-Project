const {  REGEX } = require('../utils/constants');
const validateInput = (data, fieldsToValidate = ['email', 'password', 'phoneNumber']) => {
    const errors = [];
    if (fieldsToValidate.includes('email') && !REGEX.EMAIL.test(data.email)) {
      errors.push(ERROR_MESSAGES.INVALID_EMAIL);
    }
    if (fieldsToValidate.includes('password') && !REGEX.PASSWORD.test(data.password)) {
      errors.push(ERROR_MESSAGES.INVALID_PASSWORD);
    }
    if (
      fieldsToValidate.includes('phoneNumber') &&
      data.phoneNumber &&
      !REGEX.PHONE_NUMBER.test(data.phoneNumber)
    ) {
      errors.push(ERROR_MESSAGES.INVALID_PHONE);
    }
    if (fieldsToValidate.includes('role') && data.role && !['admin', 'general'].includes(data.role)) {
      errors.push(ERROR_MESSAGES.INVALID_ROLE);
    }
    return errors;
  };
  
  module.exports = validateInput;
  