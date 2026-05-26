const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    channel:  { type: String, enum: ['Email', 'WhatsApp', 'SMS'], default: 'Email' },
    audience: { type: String, trim: true, default: 'All guests' },
    sent:     { type: Number, default: 0, min: 0 },
    opens:    { type: Number, default: 0, min: 0 },
    clicks:   { type: Number, default: 0, min: 0 },
    status:   { type: String, enum: ['Draft', 'Scheduled', 'Live', 'Completed'], default: 'Draft' },
    scheduledAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);
