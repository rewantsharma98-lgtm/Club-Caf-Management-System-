const { ROLES } = require('../config/constants');

const getBusinessFilter = (user, queryBusinessId) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    return queryBusinessId ? { business: queryBusinessId } : {};
  }
  if (user.business) {
    return { business: user.business };
  }
  return {};
};

const getBranchFilter = (user, queryBranchId) => {
  if (user.role === ROLES.SUPER_ADMIN) {
    if (queryBranchId) return { branch: queryBranchId };
    return {};
  }
  if (user.role === ROLES.BRANCH_MANAGER || user.role === ROLES.STAFF) {
    if (user.branch) return { branch: user.branch };
  }
  if (queryBranchId && user.business) return { branch: queryBranchId };
  return {};
};

const attachScope = (req, res, next) => {
  req.scope = {
    business: getBusinessFilter(req.user, req.query.businessId),
    branch: getBranchFilter(req.user, req.query.branchId),
  };
  next();
};

module.exports = { getBusinessFilter, getBranchFilter, attachScope };
