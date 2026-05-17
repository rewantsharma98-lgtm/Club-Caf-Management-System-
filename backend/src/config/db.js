const mongoose = require('mongoose');
const { getMongoOptions, formatMongoError } = require('./mongoOptions');

const cached = global._ohc_mongoose || (global._ohc_mongoose = { conn: null, promise: null });

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in backend/.env or in Vercel environment variables.');
  }

  if (uri.includes('MONGODB_URI=')) {
    throw new Error('MONGODB_URI looks malformed (duplicate "MONGODB_URI=" in the value).');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, getMongoOptions(uri))
      .then((connection) => {
        cached.conn = connection;
        console.log('MongoDB connected');
        return connection;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('\n✗ MongoDB Atlas connection failed:\n');
        console.error(formatMongoError(err));
        throw err;
      });
  }

  return cached.promise;
};

const isDbReady = () => mongoose.connection.readyState === 1;

module.exports = connectDB;
module.exports.isDbReady = isDbReady;
module.exports.getMongoOptions = getMongoOptions;
module.exports.formatMongoError = formatMongoError;
