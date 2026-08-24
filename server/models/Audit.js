const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    scheduledFor: { type: Date, required: true },
    auditor: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Scheduled', 'In progress', 'Completed'], default: 'Scheduled' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Audit', auditSchema);
