const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    number: { type: Number, required: true },
    label: { type: String, required: true, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    type: {
      type: String,
      enum: ['Standard', 'Lounge', 'VIP', 'Bar'],
      default: 'Standard',
    },
    zone: { type: String, default: 'Indoor' },
    qrCode: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

tableSchema.index({ business: 1, branch: 1, number: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
