/**
 * Test MongoDB connection. Run from backend/:  node scripts/testMongo.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const { getMongoOptions, formatMongoError } = require('../src/config/mongoOptions');

const uri = process.env.MONGODB_URI?.trim();

if (!uri) {
  console.error('MONGODB_URI is not set in backend/.env');
  process.exit(1);
}

console.log('Testing connection…');
console.log('Target:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'));

mongoose
  .connect(uri, getMongoOptions(uri))
  .then(() => {
    console.log('✓ Connected successfully');
    return mongoose.disconnect();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n✗ Failed:\n');
    console.error(formatMongoError(err));
    process.exit(1);
  });
