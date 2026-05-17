const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    featured: { type: Boolean, default: true },
    capacity: { type: Number, default: 100 },
    ticketsSold: { type: Number, default: 0 },
    memberOnly: { type: Boolean, default: false },
    minTier: { type: String, enum: ['Silver', 'Gold', 'Platinum', 'VIP Elite'], default: 'Silver' },
  },
  { timestamps: true }
);

eventSchema.index({ business: 1, date: 1 });

module.exports = mongoose.model('Event', eventSchema);
