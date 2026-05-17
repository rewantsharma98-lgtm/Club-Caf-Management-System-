const tableService = require('../services/tableService');

exports.getAvailable = async (req, res, next) => {
  try {
    const { date, time, guests, branchId, businessId } = req.query;
    if (!date || !time) {
      return res.status(400).json({ success: false, message: 'date and time are required' });
    }
    const data = await tableService.getAvailableTables({
      businessId,
      branchId,
      date,
      time,
      guests: guests || 1,
    });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
