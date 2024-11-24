const User = require('../models/user.model');

class UserService {
  async getUserById(id) {
    return User.findById(id);
  }

  async updateUserById(id, updateData) {
    updateData.updatedAt = Date.now();
    return User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteUserById(id) {
    return User.findByIdAndDelete(id);
  }

  async listUsers(filter, skip, limit) {
    return User.find(filter).skip(skip).limit(limit);
  }

  async countUsers(filter) {
    return User.countDocuments(filter);
  }
}

module.exports = new UserService();
