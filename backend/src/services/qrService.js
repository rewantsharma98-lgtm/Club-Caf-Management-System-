const crypto = require('crypto');
const QRToken = require('../models/QRToken');

exports.generate = async ({ type, business, branch, customer, referenceId, referenceModel, expiresInHours = 48 }) => {
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiresInHours);

  return QRToken.create({
    type,
    token,
    business,
    branch,
    customer,
    referenceId,
    referenceModel,
    expiresAt,
  });
};

exports.verify = async (token) => {
  const qr = await QRToken.findOne({ token, isActive: true });
  if (!qr) return { valid: false, message: 'Invalid QR code' };
  if (qr.expiresAt && qr.expiresAt < new Date()) {
    return { valid: false, message: 'QR code expired' };
  }
  if (qr.usedAt) return { valid: false, message: 'QR code already used', qr };
  return { valid: true, qr };
};

exports.scan = async (token) => {
  const result = await exports.verify(token);
  if (!result.valid) return result;
  result.qr.usedAt = new Date();
  await result.qr.save();
  return { valid: true, qr: result.qr, message: 'Check-in successful' };
};

exports.getForCustomer = (customerId) =>
  QRToken.find({ customer: customerId, isActive: true }).sort({ createdAt: -1 }).limit(10);
