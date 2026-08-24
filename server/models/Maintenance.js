const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, trim: true },
    assetName: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    issue: { type: String, required: true, trim: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    reportedBy: { type: String, required: true, trim: true },
    status: { type: String, enum: ['Open', 'In progress', 'Resolved'], default: 'Open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Maintenance', maintenanceSchema);
