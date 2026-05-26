const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const poSchema = new mongoose.Schema(
  {
    code:   { type: String, unique: true, index: true },
    vendor: { type: String, required: true, trim: true },
    items:  { type: Number, default: 0, min: 0 },
    value:  { type: Number, default: 0, min: 0 },
    eta:    { type: Date },
    status: { type: String, enum: ['Draft', 'Confirmed', 'In Transit', 'Received', 'Cancelled'], default: 'Draft' },
    notes:  { type: String, trim: true },
  },
  { timestamps: true }
);

poSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('po', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `PO-${2838 + c.seq}`;
  next();
});

module.exports = mongoose.model('PurchaseOrder', poSchema);
