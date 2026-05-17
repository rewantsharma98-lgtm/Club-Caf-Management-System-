const mongoose = require('mongoose');

const automationRuleSchema = new mongoose.Schema(
  {
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    name: { type: String, required: true },
    trigger: {
      type: String,
      enum: [
        'reservation_created',
        'reservation_approved',
        'visit_completed',
        'event_booked',
        'birthday',
        'waitlist_slot',
        'capacity_reached',
      ],
      required: true,
    },
    action: {
      type: String,
      enum: [
        'auto_confirm',
        'send_notification',
        'award_points',
        'add_to_waitlist',
        'send_offer',
      ],
      required: true,
    },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AutomationRule', automationRuleSchema);
