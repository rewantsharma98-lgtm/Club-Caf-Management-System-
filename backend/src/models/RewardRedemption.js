const mongoose = require('mongoose');

const rewardRedemptionSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    reward: { type: mongoose.Schema.Types.ObjectId, ref: 'Reward', required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    pointsSpent: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'used', 'expired'], default: 'pending' },
    code: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RewardRedemption', rewardRedemptionSchema);
