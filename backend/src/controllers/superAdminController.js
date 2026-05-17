const Business = require('../models/Business');
const User = require('../models/User');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const BusinessSubscription = require('../models/BusinessSubscription');
const AuditLog = require('../models/AuditLog');
const analyticsService = require('../services/analyticsService');

exports.getOverview = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getSuperAdminAnalytics();
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(10).populate('user', 'email');
    return res.json({ success: true, analytics, recentLogs });
  } catch (err) {
    return next(err);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const data = await SubscriptionPlan.find({ isActive: true });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.createPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);
    return res.status(201).json({ success: true, data: plan });
  } catch (err) {
    return next(err);
  }
};

exports.assignSubscription = async (req, res, next) => {
  try {
    const sub = await BusinessSubscription.findOneAndUpdate(
      { business: req.body.businessId },
      { plan: req.body.planId, status: req.body.status || 'active', currentPeriodEnd: req.body.currentPeriodEnd },
      { upsert: true, new: true }
    ).populate('plan');
    return res.json({ success: true, data: sub });
  } catch (err) {
    return next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const data = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('user', 'email username')
      .populate('business', 'name');
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.onboardBusiness = async (req, res, next) => {
  try {
    const { business, owner } = req.body;
    const created = await Business.create(business);
    const ownerUser = await User.create({
      ...owner,
      role: 'business_owner',
      business: created._id,
    });
    if (req.body.planId) {
      await BusinessSubscription.create({
        business: created._id,
        plan: req.body.planId,
        status: 'trial',
        currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
      });
    }
    return res.status(201).json({ success: true, data: { business: created, owner: ownerUser } });
  } catch (err) {
    return next(err);
  }
};
