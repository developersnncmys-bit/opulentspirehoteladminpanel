const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const bookingSchema = new mongoose.Schema(
  {
    code:     { type: String, unique: true, index: true },
    guest:    { type: String, required: true, trim: true },
    room:     { type: String, required: true, trim: true },
    checkIn:  { type: Date,   required: true },
    checkOut: { type: Date,   required: true },
    source:   { type: String, enum: ['Direct', 'MakeMyTrip', 'Booking', 'Agoda', 'Goibibo', 'Corporate', 'Walk-in'], default: 'Direct' },
    amount:   { type: Number, default: 0, min: 0 },
    status:   { type: String, enum: ['Confirmed', 'Hold', 'Cancelled', 'Checked-in', 'Checked-out'], default: 'Confirmed' },
    notes:    { type: String, trim: true },
  },
  { timestamps: true }
);

bookingSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('booking', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `BK-${10420 + c.seq}`;
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
