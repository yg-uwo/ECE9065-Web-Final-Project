const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    uri = process.env.MONGO_URI || 'mongodb+srv://group_4:final%40project@web-project.paf8p.mongodb.net/computer_ecom?retryWrites=true&w=majority&appName=web-project';
    await mongoose.connect(uri);
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
