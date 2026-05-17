const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    customerName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 50 },
    seatingPreference: { type: String, enum: ['Indoor', 'Outdoor'], default: 'Indoor' },
    table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    tableLabel: { type: String, default: '' },
    specialRequest: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
      default: 'Pending',
    },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    qrToken: { type: String },
    priorityBooking: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reservationSchema.index({ business: 1, date: 1, status: 1 });
reservationSchema.index({ email: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
