const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true },
    address: { type: String, default: '' },
    phone: { type: String },
    capacity: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

branchSchema.index({ business: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Branch', branchSchema);
