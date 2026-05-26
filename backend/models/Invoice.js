const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const invoiceLineSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    qty:         { type: Number, default: 1, min: 1 },
    rate:        { type: Number, default: 0, min: 0 },
    amount:      { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    code:        { type: String, unique: true, index: true },
    guest:       { type: String, required: true, trim: true },
    room:        { type: String, trim: true },
    checkIn:     { type: Date },
    checkOut:    { type: Date },
    description: { type: String, trim: true },
    lines:       { type: [invoiceLineSchema], default: [] },
    subtotal:    { type: Number, default: 0, min: 0 },
    discount:    { type: Number, default: 0, min: 0 },
    total:       { type: Number, required: true, min: 0 },
    gst:         { type: Number, default: 0, min: 0 },
    notes:       { type: String, trim: true },
    status:      { type: String, enum: ['Paid', 'Partial', 'Due'], default: 'Due' },
    booking:     { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  },
  { timestamps: true }
);

invoiceSchema.pre('save', async function (next) {
  if (this.lines && this.lines.length) {
    this.subtotal = this.lines.reduce((a, l) => a + (l.amount || (l.rate || 0) * (l.qty || 0)), 0);
  }
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('invoice', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `INV-${8407 + c.seq}`;
  next();
});

module.exports = mongoose.model('Invoice', invoiceSchema);
