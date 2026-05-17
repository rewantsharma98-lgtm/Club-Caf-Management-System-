const mongoose = require('mongoose');

const businessSubscriptionSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan', required: true },
    status: {
      type: String,
      enum: ['active', 'trial', 'cancelled', 'past_due'],
      default: 'trial',
    },
    currentPeriodEnd: { type: Date },
    billingReady: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessSubscription', businessSubscriptionSchema);
