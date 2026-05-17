const Event = require('../models/Event');

exports.createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    return res.status(201).json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.featured === 'true') filter.featured = true;
    if (req.query.businessId) filter.business = req.query.businessId;
    const events = await Event.find(filter).sort({ date: 1 });
    return res.json({ success: true, data: events });
  } catch (err) {
    return next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, data: event });
  } catch (err) {
    return next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    return next(err);
  }
};
