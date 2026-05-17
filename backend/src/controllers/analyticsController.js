const analyticsService = require('../services/analyticsService');
const { ROLES } = require('../config/constants');

exports.getBusinessAnalytics = async (req, res, next) => {
  try {
    const businessId =
      req.user.role === ROLES.SUPER_ADMIN
        ? req.query.businessId
        : req.user.business?.toString();
    const branchId = req.query.branchId;
    const data = await analyticsService.getBusinessAnalytics(businessId, branchId);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getSuperAdminAnalytics = async (req, res, next) => {
  try {
    const data = await analyticsService.getSuperAdminAnalytics();
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
