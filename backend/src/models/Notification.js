const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientType: { type: String, enum: ['customer', 'user'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    type: {
      type: String,
      enum: [
        'reservation_reminder',
        'birthday',
        'loyalty_update',
        'event_recommendation',
        'vip_alert',
        'membership_renewal',
        'offer',
        'system',
      ],
      required: true,
    },
    channel: {
      type: String,
      enum: ['email', 'whatsapp', 'sms', 'push', 'in_app'],
      default: 'in_app',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    sent: { type: Boolean, default: false },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

notificationSchema.index({ recipientId: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
