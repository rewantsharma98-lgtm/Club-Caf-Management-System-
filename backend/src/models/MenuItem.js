const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    category: {
      type: String,
      enum: ['signature', 'cocktails', 'spirits', 'food', 'specials', 'nightlife'],
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ business: 1, category: 1, sortOrder: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);
