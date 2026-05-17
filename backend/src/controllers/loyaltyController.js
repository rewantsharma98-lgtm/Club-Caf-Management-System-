const loyaltyService = require('../services/loyaltyService');
const Reward = require('../models/Reward');

exports.getRewards = async (req, res, next) => {
  try {
    const businessId = req.query.businessId || req.user?.business || undefined;
    const filter = businessId ? { business: businessId } : {};
    const data = await Reward.find({ ...filter, isActive: true }).sort({ pointsCost: 1 });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getCustomerLoyalty = async (req, res, next) => {
  try {
    const data = await loyaltyService.getDashboard(req.params.customerId);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.redeem = async (req, res, next) => {
  try {
    const customerId = req.customer?._id || req.body.customerId;
    const result = await loyaltyService.redeemReward(customerId, req.body.rewardId);
    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

exports.createReward = async (req, res, next) => {
  try {
    const reward = await Reward.create({
      ...req.body,
      business: req.body.business || req.user.business,
    });
    return res.status(201).json({ success: true, data: reward });
  } catch (err) {
    return next(err);
  }
};

exports.updateReward = async (req, res, next) => {
  try {
    const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, data: reward });
  } catch (err) {
    return next(err);
  }
};

exports.deleteReward = async (req, res, next) => {
  try {
    await Reward.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Reward deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.awardBonus = async (req, res, next) => {
  try {
    const { customerId, points, description } = req.body;
    const customer = await loyaltyService.earnPoints(
      customerId,
      req.user.business,
      'bonus',
      points,
      description || 'Bonus points'
    );
    return res.json({ success: true, data: customer });
  } catch (err) {
    return next(err);
  }
};
