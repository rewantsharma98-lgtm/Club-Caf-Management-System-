const Customer = require('../models/Customer');

exports.getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Customer.find(filter)
        .populate({ path: 'reservations', options: { sort: { createdAt: -1 } } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);
    return res.json({
      success: true,
      data,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    return next(err);
  }
};

exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('reservations');
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    return res.json({ success: true, data: customer });
  } catch (err) {
    return next(err);
  }
};
