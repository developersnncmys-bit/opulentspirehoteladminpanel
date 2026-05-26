const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    venue:  {
      type: String,
      enum: ['Grand Hall', 'Conf Room A', 'Pool Deck', 'Garden', 'Rooftop', 'Banquet Hall'],
      default: 'Grand Hall',
    },
    pax:    { type: Number, default: 0, min: 0 },
    date:   { type: Date, required: true },
    value:  { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['New', 'In Talk', 'Quoted', 'Won', 'Confirmed', 'Hold'], default: 'New' },
    notes:  { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
