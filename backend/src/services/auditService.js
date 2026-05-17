const AuditLog = require('../models/AuditLog');

exports.log = async ({ user, customer, business, action, resource, resourceId, req, metadata }) => {
  try {
    await AuditLog.create({
      user: user?._id || user,
      customer: customer?._id || customer,
      business: business?._id || business,
      action,
      resource,
      resourceId,
      ip: req?.ip,
      userAgent: req?.get?.('user-agent'),
      metadata,
    });
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
};
