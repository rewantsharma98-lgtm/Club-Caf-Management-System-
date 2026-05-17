const qrService = require('../services/qrService');
const Reservation = require('../models/Reservation');
const Customer = require('../models/Customer');
const loyaltyService = require('../services/loyaltyService');
const automationService = require('../services/automationService');
const notificationService = require('../services/notificationService');

exports.generate = async (req, res, next) => {
  try {
    const qr = await qrService.generate(req.body);
    return res.status(201).json({ success: true, data: qr });
  } catch (err) {
    return next(err);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const result = await qrService.verify(req.params.token);
    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
};

exports.scan = async (req, res, next) => {
  try {
    const result = await qrService.scan(req.params.token);
    if (result.valid && result.qr.customer) {
      const customer = await Customer.findById(result.qr.customer);
      if (result.qr.type === 'loyalty' || result.qr.type === 'check_in') {
        await loyaltyService.awardVisit(result.qr.customer, result.qr.business);
      }
      if (customer) {
        await automationService.runTrigger('visit_completed', {
          business: result.qr.business,
          branch: result.qr.branch,
          customer,
        });
        await notificationService.create({
          recipientType: 'customer',
          recipientId: customer._id,
          business: result.qr.business,
          type: 'loyalty_update',
          title: 'Check-in complete',
          message: 'Points have been added to your loyalty balance.',
        });
      }
    }
    if (result.valid && result.qr.type === 'reservation' && result.qr.referenceId) {
      const reservation = await Reservation.findById(result.qr.referenceId);
      if (reservation && ['Approved', 'Pending'].includes(reservation.status)) {
        reservation.status = 'Completed';
        await reservation.save();
        if (reservation.customer) {
          await loyaltyService.awardReservation(
            reservation.customer,
            reservation.business,
            reservation._id
          );
          const customer = await Customer.findById(reservation.customer);
          if (customer) {
            await automationService.runTrigger('visit_completed', {
              business: reservation.business,
              branch: reservation.branch,
              customer,
              reservation,
            });
          }
        }
      }
    }
    return res.json({ success: true, ...result });
  } catch (err) {
    return next(err);
  }
};

exports.generateForReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }
    const qr = await qrService.generate({
      type: 'reservation',
      business: reservation.business,
      branch: reservation.branch,
      customer: reservation.customer,
      referenceId: reservation._id,
      referenceModel: 'Reservation',
    });
    reservation.qrToken = qr.token;
    await reservation.save();
    return res.json({ success: true, data: qr });
  } catch (err) {
    return next(err);
  }
};
