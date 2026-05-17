const mongoose = require('mongoose');

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    type: {
      type: String,
      enum: ['earn_visit', 'earn_reservation', 'earn_event', 'earn_spend', 'redeem', 'bonus', 'birthday'],
      required: true,
    },
    points: { type: Number, required: true },
    description: { type: String, default: '' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceModel: { type: String },
  },
  { timestamps: true }
);

loyaltyTransactionSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('LoyaltyTransaction', loyaltyTransactionSchema);
