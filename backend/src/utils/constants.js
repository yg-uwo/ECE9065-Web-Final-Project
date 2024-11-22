const ERROR_MESSAGES = {
    USER_ALREADY_EXISTS: 'User already exists.',
    USER_NOT_FOUND: 'User not found.',
    INVALID_CREDENTIALS: 'Invalid credentials.',
    UNAUTHORIZED_ACCESS: 'Access denied. You are not authorized to perform this action.',
    INVALID_EMAIL: 'Invalid email format.',
    INVALID_PASSWORD: 'Password must be at least 8 characters, with at least one letter and one number.',
    INVALID_PHONE: 'Phone number must be between 10-15 digits.',
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
  