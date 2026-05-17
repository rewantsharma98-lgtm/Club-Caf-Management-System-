const mongoose = require('mongoose');

const qrTokenSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['reservation', 'event_ticket', 'check_in', 'loyalty', 'table'],
      required: true,
    },
    token: { type: String, required: true, unique: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceModel: { type: String },
    expiresAt: { type: Date },
    usedAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QRToken', qrTokenSchema);
