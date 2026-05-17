const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
    action: { type: String, required: true },
    resource: { type: String },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

auditLogSchema.index({ business: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
