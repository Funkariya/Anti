const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcryptjs');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      console.log('📦 No MongoDB URI found, starting in-memory database...');
      mongoServer = new MongoMemoryServer();
      await mongoServer.start();
      uri = mongoServer.getUri();
    }

    await mongoose.connect(uri);
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

    // Seed admin user
    const User = require('../models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin',
        email: 'admin@artflow.studio',
        password: hashed,
        company: 'ArtFlow Studio',
        role: 'admin',
      });
      console.log('👤 Admin seeded → admin@artflow.studio / admin123');
    }
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = { connectDB };
