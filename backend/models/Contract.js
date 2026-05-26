const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    gst:     { type: String, trim: true },
    rate:    { type: Number, default: 0, min: 0 },
    credit:  { type: Number, default: 0, min: 0 },
    billing: { type: String, enum: ['Monthly', 'Fortnightly', 'Per event'], default: 'Monthly' },
    contact: { type: String, trim: true },
    active:  { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contract', contractSchema);
