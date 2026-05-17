const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: {
      type: String,
      enum: ['cafe', 'pub', 'lounge', 'restaurant', 'club', 'nightlife'],
      default: 'cafe',
    },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    email: { type: String, lowercase: true },
    phone: { type: String },
    address: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    settings: {
      autoConfirmReservations: { type: Boolean, default: false },
      loyaltyEnabled: { type: Boolean, default: true },
      membershipsEnabled: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
