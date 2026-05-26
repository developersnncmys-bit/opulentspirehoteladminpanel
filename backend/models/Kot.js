const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const kotSchema = new mongoose.Schema(
  {
    code:   { type: String, unique: true, index: true },
    table:  { type: String, required: true, trim: true },
    items:  { type: Number, default: 0, min: 0 },
    total:  { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ['Cooking', 'Ready', 'Served', 'Cancelled'], default: 'Cooking' },
  },
  { timestamps: true }
);

kotSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('kot', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `KOT-${3417 + c.seq}`;
  next();
});

module.exports = mongoose.model('Kot', kotSchema);
