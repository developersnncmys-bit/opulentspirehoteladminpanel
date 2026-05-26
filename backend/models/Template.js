const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, unique: true },
    channels: [{ type: String, enum: ['Email', 'WhatsApp', 'SMS'] }],
    trigger:  { type: String, trim: true, default: 'Manual' },
    body:     { type: String, trim: true },
    active:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Template', templateSchema);
