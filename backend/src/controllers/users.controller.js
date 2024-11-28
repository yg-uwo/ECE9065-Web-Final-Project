const { signupService } = require('../services/auth.services');
const UserService = require('../services/users.services');
const validateInput = require('../utils/validate_user_input');
const { SUCCESS_MESSAGES } = require('../utils/constants');

//Login to 
exports.addUser = async (req, res) => {
    try {
        const errors = validateInput(req.body, ['email', 'password', 'phoneNumber', 'role']); 
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }
        const { first_name, last_name, email, password, phoneNumber, role } = req.body;
        const user = await signupService({ first_name, last_name, email, password, phoneNumber, role });
        res.status(201).json({ message: SUCCESS_MESSAGES.USER_REGISTERED,data:user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update User API
exports.updateUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const { first_name, last_name, email, password, phoneNumber, role } = req.body;
  
      // role must be updated by admin only
      const existingUser = await UserService.getUserById(id);
      if (existingUser && existingUser.role === 'general' && role) {
        return res.status(400).json({ message: ERROR_MESSAGES.UNAUTHORIZED_ROLE_UPDATE });
      }
      const updatedData = { first_name, last_name, email, password, phoneNumber, role };
  
      //check if there is undefine value in request body
      Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
  
      const updatedUser = await UserService.updateUserById(id, updatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete User API
  exports.deleteUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const deletedUser = await UserService.deleteUserById(id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


exports.listUsers = async (req, res) => {
    try {
      const { first_name, last_name, email, role, phoneNumber, page = 1, limit = 10 } = req.query;
      const filter = {};
      if (first_name) filter.first_name = { $regex: first_name, $options: 'i' }; 
      if (last_name) filter.last_name = { $regex: last_name, $options: 'i' };
      if (email) filter.email = { $regex: email, $options: 'i' };
      if (role) filter.role = role;
      if (phoneNumber) filter.phoneNumber = { $regex: phoneNumber, $options: 'i' };

      // Pagination logic
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;
  
  
      const users = await UserService.listUsers(filter, skip, pageSize);
      const totalUsers = await UserService.countUsers(filter);
  
      res.status(200).json({
        data: users,
        total: totalUsers,
        page: pageNumber,
        limit: pageSize,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//get user with id
exports.getUser = async(req,res) => {
  try {
    const { id } = req.params; 
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const user = await UserService.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}