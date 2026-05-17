const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Reservation = require('../models/Reservation');
const Business = require('../models/Business');
const loyaltyService = require('../services/loyaltyService');
const membershipService = require('../services/membershipService');
const notificationService = require('../services/notificationService');
const { getPersonalizedOffers } = require('../services/customerService');
const qrService = require('../services/qrService');
const aiReady = require('../services/aiReady');

const signCustomerToken = (id) =>
  jwt.sign({ id, type: 'customer' }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = async (req, res, next) => {
  try {
    const { name, phone, email, password, businessSlug } = req.body;
    const business = businessSlug
      ? await Business.findOne({ slug: businessSlug })
      : await Business.findOne({ isActive: true });
    if (!business) {
      return res.status(400).json({ success: false, message: 'Business not found' });
    }
    const exists = await Customer.findOne({ email, business: business._id });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const customer = await Customer.create({
      name,
      phone,
      email,
      password,
      business: business._id,
      loyaltyPoints: 100,
      lifetimePoints: 100,
    });
    const token = signCustomerToken(customer._id);
    return res.status(201).json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        tier: customer.membershipTier,
        points: customer.loyaltyPoints,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email }).select('+password');
    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signCustomerToken(customer._id);
    return res.json({
      success: true,
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        tier: customer.membershipTier,
        points: customer.loyaltyPoints,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.getProfile = async (req, res) => {
  const c = req.customer;
  res.json({
    success: true,
    data: {
      id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      tier: c.membershipTier,
      points: c.loyaltyPoints,
      preferences: c.preferences,
      membership: membershipService.getMembershipInfo(c),
      offers: getPersonalizedOffers(c),
    },
  });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'birthday', 'preferences'];
    const hadBirthday = req.customer.birthday;
    allowed.forEach((k) => {
      if (req.body[k] !== undefined) req.customer[k] = req.body[k];
    });
    await req.customer.save();

    if (req.body.birthday && !hadBirthday) {
      await loyaltyService.earnPoints(
        req.customer._id,
        req.customer.business,
        'birthday',
        200,
        'Birthday reward — welcome bonus'
      );
      await notificationService.sendBirthdayWish(req.customer);
    }

    return res.json({
      success: true,
      data: {
        id: req.customer._id,
        name: req.customer.name,
        email: req.customer.email,
        phone: req.customer.phone,
        birthday: req.customer.birthday,
        preferences: req.customer.preferences,
        tier: req.customer.membershipTier,
        points: req.customer.loyaltyPoints,
        membership: membershipService.getMembershipInfo(req.customer),
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.getMembership = async (req, res, next) => {
  try {
    const loyalty = await loyaltyService.getDashboard(req.customer._id);
    return res.json({
      success: true,
      membership: membershipService.getMembershipInfo(req.customer),
      loyalty,
      tierHistory: [{ tier: req.customer.membershipTier, since: req.customer.membershipSince }],
    });
  } catch (err) {
    return next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const loyalty = await loyaltyService.getDashboard(req.customer._id);
    const reservations = await Reservation.find({ customer: req.customer._id })
      .sort({ date: -1 })
      .limit(5);
    const notifications = await notificationService.getForRecipient(req.customer._id);
    const recommendations = await aiReady.recommendations.getEventSuggestions({
      tier: req.customer.membershipTier,
      preferences: req.customer.preferences,
    });
    return res.json({
      success: true,
      loyalty,
      reservations,
      notifications: notifications.slice(0, 5),
      unreadCount: notifications.filter((n) => !n.read).length,
      recommendations,
      membership: membershipService.getMembershipInfo(req.customer),
      offers: getPersonalizedOffers(req.customer),
    });
  } catch (err) {
    return next(err);
  }
};

exports.getReservations = async (req, res, next) => {
  try {
    const data = await Reservation.find({ customer: req.customer._id }).sort({ date: -1 });
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const data = await notificationService.getForRecipient(req.customer._id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    const data = await notificationService.markRead(req.params.id, req.customer._id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};

exports.getQRs = async (req, res, next) => {
  try {
    const data = await qrService.getForCustomer(req.customer._id);
    return res.json({ success: true, data });
  } catch (err) {
    return next(err);
  }
};
