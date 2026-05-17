const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, lowercase: true },
    guests: { type: Number, default: 2 },
    date: { type: Date, required: true },
    status: { type: String, enum: ['waiting', 'notified', 'seated', 'cancelled'], default: 'waiting' },
    position: { type: Number, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Waitlist', waitlistSchema);
