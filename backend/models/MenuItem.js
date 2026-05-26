const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    category: { type: String, enum: ['Starter', 'Main', 'Seafood', 'Dessert', 'Beverage', 'Other'], default: 'Main' },
    price:    { type: Number, required: true, min: 0 },
    available:{ type: Boolean, default: true },
    notes:    { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
