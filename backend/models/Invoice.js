const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const invoiceSchema = new mongoose.Schema(
  {
    code:    { type: String, unique: true, index: true },
    guest:   { type: String, required: true, trim: true },
    room:    { type: String, trim: true },
    total:   { type: Number, required: true, min: 0 },
    gst:     { type: Number, default: 0, min: 0 },
    status:  { type: String, enum: ['Paid', 'Partial', 'Due'], default: 'Due' },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('invoice', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `INV-${8407 + c.seq}`;
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
