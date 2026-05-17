const Business = require('../models/Business');
const Branch = require('../models/Branch');
const BusinessSubscription = require('../models/BusinessSubscription');
const auditService = require('../services/auditService');

exports.getBusinesses = async (req, res, next) => {
  try {
    const data = await Business.find().sort({ createdAt: -1 });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getBusiness = async (req, res, next) => {
  try {
    const business = await Business.findById(req.params.id);
    const branches = await Branch.find({ business: req.params.id });
    const subscription = await BusinessSubscription.findOne({ business: req.params.id }).populate('plan');
    return res.json({ success: true, data: { business, branches, subscription } });
  } catch (err) {
    return next(err);
  }
};

exports.createBusiness = async (req, res, next) => {
  try {
    const business = await Business.create(req.body);
    await auditService.log({
      user: req.user,
      business: business._id,
      action: 'business_created',
      resource: 'Business',
      resourceId: business._id,
      req,
    });
    return res.status(201).json({ success: true, data: business });
  } catch (err) {
    return next(err);
  }
};

exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, data: business });
  } catch (err) {
    return next(err);
  }
};

exports.getMyBusiness = async (req, res, next) => {
  try {
    const id = req.user.business || req.params.id;
    const business = await Business.findById(id);
    const branches = await Branch.find({ business: id });
    return res.json({ success: true, data: { business, branches } });
  } catch (err) {
    return next(err);
  }
};
