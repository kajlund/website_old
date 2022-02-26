const UserModel = require('../models/User');

class UserService {
  static async getAll() {
    return UserModel.find({}).sort({ createdAt: -1 }).select('-password');
  }

  static async getOne(userId) {
    return UserModel.findById(userId).exec();
  }

  static async getUserByEmail(email) {
    return UserModel.findOne({ email }).exec();
  }

  static async createUser(data) {
    const user = new UserModel(data);
    return user.save();
  }

  static async update(userId, data) {
    // Fetch the user first
    const user = await UserModel.findById(userId);
    user.email = data.email;

    // Only set the password if it was modified
    if (data.password) {
      user.password = data.password;
    }

    return user.save();
  }

  static async remove(userId) {
    return UserModel.deleteOne({ _id: userId }).exec();
  }
}

module.exports = UserService;
