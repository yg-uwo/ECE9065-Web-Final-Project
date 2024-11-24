const ERROR_MESSAGES = {
    USER_ALREADY_EXISTS: 'User already exists.',
    USER_NOT_FOUND: 'User not found.',
    INCORRECT_PASSWORD: 'Password is incorrect',
    UNAUTHORIZED_ACCESS: 'Access denied. You are not authorized to perform this action.',
    INVALID_TOKEN:"Invalid Token",
    INVALID_EMAIL: 'Invalid email format.',
    INVALID_PASSWORD: 'Password must be at least 8 characters, with at least one letter and one number.',
    INVALID_PHONE: 'Phone number must be between 10-15 digits.',
    MISSING_REQUIRED_FIELDS: 'Product ID and category are required fields.',
    PRODUCT_NOT_FOUND: 'Product not found.',
  };

  const REGEX= {
    PHONE_NUMBER: /^[0-9]{10,15}$/,
    NAME: /^[A-Za-z\s]{2,50}$/,
    EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
  };
  
  const SUCCESS_MESSAGES = {
    USER_REGISTERED: 'User registered successfully.',
    LOGIN_SUCCESS: 'Login successful.',
    PRODUCT_CREATED: 'Product created successfully.',
    PRODUCT_UPDATED: 'Product updated successfully.',
    PRODUCT_DELETED: 'Product deleted successfully.',
  };
  
  // Roles
  const ROLES = {
    ADMIN: 'admin',
    GENERAL: 'general',
  };
  
  module.exports = {
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    ROLES,
    REGEX
  };
  