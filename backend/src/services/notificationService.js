const Notification = require('../models/Notification');

const channelHandlers = {
  email: async (notification) => {
    // Email provider integration point (SendGrid, SES, etc.)
    console.log(`[EMAIL] ${notification.title}: ${notification.message}`);
    return true;
  },
  whatsapp: async (notification) => {
    console.log(`[WHATSAPP-READY] ${notification.title}`);
    return true;
  },
  sms: async (notification) => {
    console.log(`[SMS-READY] ${notification.title}`);
    return true;
  },
  push: async (notification) => {
    console.log(`[PUSH-READY] ${notification.title}`);
    return true;
  },
  in_app: async () => true,
};

exports.create = async ({
  recipientType,
  recipientId,
  business,
  type,
  channel = 'in_app',
  title,
  message,
  metadata,
  alsoSend = false,
}) => {
  const notification = await Notification.create({
    recipientType,
    recipientId,
    business,
    type,
    channel,
    title,
    message,
    metadata,
    sent: channel === 'in_app',
  });

  if (alsoSend && channel !== 'in_app' && channelHandlers[channel]) {
    await channelHandlers[channel](notification);
    notification.sent = true;
    await notification.save();
  }

  return notification;
};

exports.getForRecipient = (recipientId, recipientType = 'customer', limit = 30) =>
  Notification.find({ recipientId, recipientType }).sort({ createdAt: -1 }).limit(limit);

exports.markRead = (id, recipientId) =>
  Notification.findOneAndUpdate({ _id: id, recipientId }, { read: true }, { new: true });

exports.markAllRead = (recipientId) =>
  Notification.updateMany({ recipientId, read: false }, { read: true });

exports.sendReservationReminder = (customer, reservation) =>
  exports.create({
    recipientType: 'customer',
    recipientId: customer._id,
    business: reservation.business,
    type: 'reservation_reminder',
    channel: 'in_app',
    title: 'Reservation Reminder',
    message: `Your table for ${reservation.guests} is booked on ${new Date(reservation.date).toLocaleDateString()} at ${reservation.time}.`,
    metadata: { reservationId: reservation._id },
    alsoSend: true,
  });

exports.sendBirthdayWish = (customer) =>
  exports.create({
    recipientType: 'customer',
    recipientId: customer._id,
    business: customer.business,
    type: 'birthday',
    channel: 'in_app',
    title: 'Happy Birthday!',
    message: 'Enjoy a complimentary drink on us — redeem 200 bonus points today.',
    alsoSend: true,
  });
