const Reservation = require('../models/Reservation');
const Business = require('../models/Business');
const { upsertCustomer } = require('../services/customerService');
const { getBusinessFilter } = require('../middleware/businessScope');
const automationService = require('../services/automationService');
const notificationService = require('../services/notificationService');
const qrService = require('../services/qrService');
const loyaltyService = require('../services/loyaltyService');
const membershipService = require('../services/membershipService');
const tableService = require('../services/tableService');
const Table = require('../models/Table');

const resolveBusiness = async (body) => {
  if (body.business) return body.business;
  const biz = await Business.findOne({ isActive: true });
  return biz?._id;
};

exports.createReservation = async (req, res, next) => {
  try {
    const bookingDate = new Date(req.body.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({ success: false, message: 'Cannot book past dates' });
    }
    const businessId = await resolveBusiness(req.body);
    const payload = { ...req.body, business: businessId };

    const customer = await upsertCustomer({
      name: req.body.customerName,
      phone: req.body.phone,
      email: req.body.email,
      businessId,
    });

    if (membershipService.hasPriorityBooking(customer)) {
      payload.priorityBooking = true;
    }

    if (req.body.table) {
      const available = await tableService.getAvailableTables({
        businessId,
        branchId: payload.branch,
        date: req.body.date,
        time: req.body.time,
        guests: req.body.guests,
      });
      const match = available.find(
        (t) => String(t._id) === String(req.body.table) && t.available
      );
      if (!match) {
        return res.status(400).json({ success: false, message: 'Selected table is not available' });
      }
      const tableDoc = await Table.findById(req.body.table);
      payload.table = tableDoc._id;
      payload.tableLabel = tableDoc.label;
    }

    const reservation = await Reservation.create({
      ...payload,
      customer: customer._id,
    });

    customer.reservations.push(reservation._id);
    await customer.save();

    const qr = await qrService.generate({
      type: 'reservation',
      business: businessId,
      branch: payload.branch,
      customer: customer._id,
      referenceId: reservation._id,
      referenceModel: 'Reservation',
    });
    reservation.qrToken = qr.token;
    await reservation.save();

    await automationService.runTrigger('reservation_created', {
      business: businessId,
      branch: payload.branch,
      reservation,
      customer,
    });

    await notificationService.create({
      recipientType: 'customer',
      recipientId: customer._id,
      business: businessId,
      type: 'reservation_reminder',
      title: 'Reservation Received',
      message: `Your table request for ${reservation.guests} guests is ${reservation.status}.`,
    });

    return res.status(201).json({ success: true, data: reservation, qrToken: qr.token });
  } catch (err) {
    return next(err);
  }
};

exports.getReservations = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const filter = { ...getBusinessFilter(req.user, req.query.businessId) };
    if (req.query.branchId) filter.branch = req.query.branchId;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [data, total] = await Promise.all([
      Reservation.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Reservation.countDocuments(filter),
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

exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    return res.json({ success: true, data: reservation });
  } catch (err) {
    return next(err);
  }
};

exports.updateReservation = async (req, res, next) => {
  try {
    const prev = await Reservation.findById(req.params.id);
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    if (prev?.status !== 'Completed' && reservation.status === 'Completed' && reservation.customer) {
      await loyaltyService.awardReservation(
        reservation.customer,
        reservation.business,
        reservation._id
      );
    }
    return res.json({ success: true, data: reservation });
  } catch (err) {
    return next(err);
  }
};

exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    return res.json({ success: true, message: 'Reservation deleted' });
  } catch (err) {
    return next(err);
  }
};

exports.approveReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: 'Approved' },
      { new: true }
    );
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    await automationService.runTrigger('reservation_approved', {
      business: reservation.business,
      branch: reservation.branch,
      reservation,
    });
    return res.json({ success: true, data: reservation });
  } catch (err) {
    return next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const filter = getBusinessFilter(req.user, req.query.businessId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [total, pending, approved, todayBookings, recent] = await Promise.all([
      Reservation.countDocuments(filter),
      Reservation.countDocuments({ ...filter, status: 'Pending' }),
      Reservation.countDocuments({ ...filter, status: 'Approved' }),
      Reservation.countDocuments({ ...filter, date: { $gte: today, $lt: tomorrow } }),
      Reservation.find(filter).sort({ createdAt: -1 }).limit(8),
    ]);

    return res.json({
      success: true,
      stats: { total, pending, approved, todayBookings },
      recent,
    });
  } catch (err) {
    return next(err);
  }
};
