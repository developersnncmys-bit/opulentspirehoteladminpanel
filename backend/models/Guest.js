const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    email:   { type: String, lowercase: true, trim: true },
    phone:   { type: String, trim: true },
    loyalty: { type: String, enum: ['Member', 'Silver', 'Gold', 'Platinum'], default: 'Member' },
    stays:   { type: Number, default: 0, min: 0 },
    last:    { type: Date },
    city:    { type: String, trim: true },
    prefs:   { type: String, trim: true },
    blacklisted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guest', guestSchema);
