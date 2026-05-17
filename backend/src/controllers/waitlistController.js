const Waitlist = require('../models/Waitlist');

exports.getWaitlist = async (req, res, next) => {
  try {
    const filter = { business: req.user.business };
    if (req.query.branchId) filter.branch = req.query.branchId;
    const data = await Waitlist.find(filter).sort({ position: 1, createdAt: 1 });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.addToWaitlist = async (req, res, next) => {
  try {
    const count = await Waitlist.countDocuments({
      business: req.body.business,
      branch: req.body.branch,
      status: 'waiting',
    });
    const entry = await Waitlist.create({ ...req.body, position: count + 1 });
    return res.status(201).json({ success: true, data: entry });
  } catch (err) {
    return next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const entry = await Waitlist.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    return res.json({ success: true, data: entry });
  } catch (err) {
    return next(err);
  }
};
