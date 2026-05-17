/** Shared Mongoose connection options for Atlas and local MongoDB */
function getMongoOptions(uri) {
  const isAtlas = typeof uri === 'string' && uri.startsWith('mongodb+srv://');

  const options = {
    serverSelectionTimeoutMS: 15000,
  };

  // Forcing IPv4 can break Atlas TLS on some Windows networks — only use for local URIs
  if (!isAtlas) {
    options.family = 4;
  }

  return options;
}

function formatMongoError(err) {
  const msg = err?.message || String(err);

  if (msg.includes('ECONNREFUSED') && msg.includes('27017')) {
    return [
      'Cannot reach MongoDB on localhost:27017.',
      'Start local MongoDB or run: docker compose up -d',
      'Or set MONGODB_URI to your MongoDB Atlas connection string in backend/.env',
    ].join('\n');
  }

  if (msg.includes('alert internal error')) {
    return [
      'MongoDB Atlas TLS handshake failed (IP whitelist is usually NOT the cause if 0.0.0.0/0 is Active).',
      '',
      'Try in order:',
      '1. Atlas → Database → Connect → Drivers → copy a NEW connection string',
      '2. Atlas → Database Access → edit user → reset password → paste new URI into backend/.env',
      '3. Confirm cluster status is not Paused (Atlas → Database → cluster green/Active)',
      '4. Test the same URI in MongoDB Compass — if Compass fails, fix Atlas/credentials first',
      '5. Turn off VPN; temporarily disable antivirus HTTPS scanning / SSL inspection',
      '6. Try another network (mobile hotspot)',
      '',
      'Local fallback: install MongoDB Community, then:',
      'MONGODB_URI=mongodb://127.0.0.1:27017/openhousecafe',
    ].join('\n');
  }

  if (msg.includes('whitelist') || msg.includes('TLS') || msg.includes('SSL')) {
    return [
      'MongoDB Atlas connection failed.',
      '',
      '1. Atlas → Network Access → ensure your IP or 0.0.0.0/0 is Active',
      '2. Atlas → Database Access → reset password and update backend/.env',
      '3. Connection string: one line, no spaces after MONGODB_URI=',
      '',
      'Local: MONGODB_URI=mongodb://127.0.0.1:27017/openhousecafe',
    ].join('\n');
  }

  return msg;
}

module.exports = { getMongoOptions, formatMongoError };
