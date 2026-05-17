const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');

const protectCustomer = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'customer') {
      return res.status(401).json({ success: false, message: 'Invalid token type' });
    }
    const customer = await Customer.findById(decoded.id);
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Customer not found' });
    }
    req.customer = customer;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { protectCustomer };
