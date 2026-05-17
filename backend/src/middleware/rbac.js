const { ROLES } = require('../config/constants');

const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
  const role = req.user.role;
  const normalized = role === ROLES.ADMIN ? ROLES.BUSINESS_OWNER : role;
  const allowed = allowedRoles.flat();
  if (allowed.includes(role) || allowed.includes(normalized)) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Insufficient permissions' });
};

const superAdminOnly = authorize(ROLES.SUPER_ADMIN);
const businessAdmin = authorize(
  ROLES.SUPER_ADMIN,
  ROLES.BUSINESS_OWNER,
  ROLES.BRANCH_MANAGER,
  ROLES.ADMIN
);

module.exports = { authorize, superAdminOnly, businessAdmin };
