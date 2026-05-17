const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }],
    totalVisits: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    lifetimePoints: { type: Number, default: 0 },
    membershipTier: {
      type: String,
      enum: ['Silver', 'Gold', 'Platinum', 'VIP Elite'],
      default: 'Silver',
    },
    membershipSince: { type: Date, default: Date.now },
    birthday: { type: Date },
    preferences: {
      seatingPreference: { type: String, enum: ['Indoor', 'Outdoor', ''], default: '' },
      favoriteDrinks: [String],
      favoriteEvents: [String],
      dietaryNotes: { type: String, default: '' },
    },
    engagement: {
      visitFrequency: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
      lastVisit: { type: Date },
      tags: [String],
    },
    offers: [{ title: String, description: String, expiresAt: Date, used: { type: Boolean, default: false } }],
  },
  { timestamps: true }
);

customerSchema.index({ email: 1, business: 1 });
customerSchema.index({ phone: 1 });

customerSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  return next();
});

customerSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
