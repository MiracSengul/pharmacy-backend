const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    const uri = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(uri);
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;