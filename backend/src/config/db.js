const mongoose = require('mongoose');
const { getMongoOptions, formatMongoError } = require('./mongoOptions');

const RETRY_MS = 8000;

const connectDB = () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    console.error('\n✗ MONGODB_URI is missing in backend/.env\n');
    console.error('  Copy backend/.env.example → backend/.env and set your connection string.\n');
    return;
  }

  if (uri.includes('MONGODB_URI=')) {
    console.error('\n✗ MONGODB_URI looks malformed (duplicate "MONGODB_URI=" in the value).');
    console.error('  Fix backend/.env to a single line, e.g.:');
    console.error('  MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/openhousecafe\n');
    return;
  }

  const attempt = async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoose.connect(uri, getMongoOptions(uri));
      console.log('MongoDB connected');
    } catch (err) {
      console.error('\n✗ MongoDB connection failed:\n');
      console.error(formatMongoError(err));
      console.error(`\n→ Retrying in ${RETRY_MS / 1000}s...\n`);
      setTimeout(attempt, RETRY_MS);
    }
  };

  attempt();
};

const isDbReady = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDbReady = isDbReady;
module.exports.getMongoOptions = getMongoOptions;
module.exports.formatMongoError = formatMongoError;
