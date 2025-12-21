const mongoose = require('mongoose');
const dotenv = require('dotenv');
const customEnv = require('./config/env');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(customEnv.MONGODB_URI || process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Migration function
const migrateRoles = async () => {
  try {
    // Update all 'shipper' users to 'client'
    const shipperResult = await User.updateMany(
      { role: 'shipper' },
      { $set: { role: 'client' } }
    );
    console.log(`Updated ${shipperResult.modifiedCount} 'shipper' users to 'client'`);

    // Update all 'transporter' users to 'worker'
    const transporterResult = await User.updateMany(
      { role: 'transporter' },
      { $set: { role: 'worker' } }
    );
    console.log(`Updated ${transporterResult.modifiedCount} 'transporter' users to 'worker'`);

    console.log('Role migration completed successfully!');
  } catch (error) {
    console.error('Error during role migration:', error);
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateRoles();
  mongoose.connection.close();
  console.log('Database connection closed');
};

runMigration();