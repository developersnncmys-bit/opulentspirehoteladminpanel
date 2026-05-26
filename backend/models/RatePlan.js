const mongoose = require('mongoose');

const ratePlanSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    rooms:        { type: String, enum: ['All', 'Standard', 'Deluxe', 'Premium', 'Suite'], default: 'All' },
    base:         { type: Number, default: 0, min: 0 },
    restrictions: { type: String, trim: true, default: '—' },
    active:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RatePlan', ratePlanSchema);
