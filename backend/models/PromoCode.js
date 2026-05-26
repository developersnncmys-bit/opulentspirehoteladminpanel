const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema(
  {
    code:     { type: String, required: true, trim: true, uppercase: true, unique: true, index: true },
    discount: { type: Number, required: true, min: 0, max: 100 }, // percent
    maxUses:  { type: Number, default: 0 }, // 0 = unlimited
    uses:     { type: Number, default: 0 },
    expires:  { type: Date },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoCode', promoCodeSchema);
