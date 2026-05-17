const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    pointsCost: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ['drink', 'discount', 'priority', 'event', 'birthday', 'vip'],
      default: 'drink',
    },
    isActive: { type: Boolean, default: true },
    vipOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reward', rewardSchema);
