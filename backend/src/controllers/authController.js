const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ROLES } = require('../config/constants');

const signToken = (id) =>
  jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const formatUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  role: user.role,
  business: user.business,
  branch: user.branch,
});

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isActive || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    user.lastLogin = new Date();
    await user.save();
    const token = signToken(user._id);
    const redirect =
      user.role === ROLES.SUPER_ADMIN
        ? '/super-admin'
        : '/admin';
    return res.json({
      success: true,
      token,
      user: formatUser(user),
      redirect,
    });
  } catch (err) {
    return next(err);
  }
};

exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.verify = async (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
};
