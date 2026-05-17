const automationService = require('../services/automationService');

exports.getRules = async (req, res, next) => {
  try {
    const businessId = req.user.business || req.query.businessId;
    const data = await automationService.getRules(businessId);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.createRule = async (req, res, next) => {
  try {
    const data = await automationService.createRule({
      ...req.body,
      business: req.body.business || req.user.business,
    });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.updateRule = async (req, res, next) => {
  try {
    const data = await automationService.updateRule(req.params.id, req.body);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.deleteRule = async (req, res, next) => {
  try {
    await automationService.deleteRule(req.params.id);
    return res.json({ success: true, message: 'Rule deleted' });
  } catch (err) {
    return next(err);
  }
};
