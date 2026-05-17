const notificationService = require('../services/notificationService');

exports.send = async (req, res, next) => {
  try {
    const data = await notificationService.create({
      ...req.body,
      business: req.body.business || req.user.business,
      recipientType: req.body.recipientType || 'customer',
    });
    return res.status(201).json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getBusinessNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const data = await Notification.find({ business: req.user.business })
      .sort({ createdAt: -1 })
      .limit(50);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
