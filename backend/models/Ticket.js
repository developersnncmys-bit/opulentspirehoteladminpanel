const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const ticketSchema = new mongoose.Schema(
  {
    code:     { type: String, unique: true, index: true },
    location: { type: String, required: true, trim: true },
    issue:    { type: String, required: true, trim: true },
    assigned: { type: String, trim: true, default: 'Unassigned' },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    sla:      { type: String, default: '6h' },
    status:   { type: String, enum: ['Open', 'In Progress', 'Escalated', 'Closed'], default: 'Open' },
    closedAt: { type: Date },
  },
  { timestamps: true }
);

ticketSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('ticket', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `MT-${2036 + c.seq}`;
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
