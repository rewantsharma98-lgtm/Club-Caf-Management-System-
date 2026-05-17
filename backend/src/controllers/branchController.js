const Branch = require('../models/Branch');
const { getBusinessFilter } = require('../middleware/businessScope');

exports.getBranches = async (req, res, next) => {
  try {
    const filter = getBusinessFilter(req.user, req.query.businessId);
    const data = await Branch.find(filter).populate('business', 'name slug');
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create({
      ...req.body,
      business: req.body.business || req.user.business,
    });
    return res.status(201).json({ success: true, data: branch });
  } catch (err) {
    return next(err);
  }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, data: branch });
  } catch (err) {
    return next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Branch deleted' });
  } catch (err) {
    return next(err);
  }
};
