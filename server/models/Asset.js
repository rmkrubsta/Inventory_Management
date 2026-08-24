const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema(
  {
    assetId: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    model: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Maintenance', 'Lost', 'Retired'],
      default: 'Available'
    },
    assignedTo: { type: String, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
