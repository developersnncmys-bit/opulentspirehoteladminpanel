const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({ _id: String, seq: { type: Number, default: 0 } });
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

const employeeSchema = new mongoose.Schema(
  {
    code:   { type: String, unique: true, index: true },
    name:   { type: String, required: true, trim: true },
    role:   { type: String, trim: true },
    dept:   {
      type: String,
      enum: ['Management', 'Front Desk', 'Housekeeping', 'Maintenance', 'F&B', 'Spa', 'Admin'],
      default: 'Front Desk',
    },
    joined: { type: Date, default: Date.now },
    salary: { type: Number, default: 0, min: 0 },
    email:  { type: String, lowercase: true, trim: true },
    phone:  { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

employeeSchema.pre('save', async function (next) {
  if (this.code) return next();
  const c = await Counter.findByIdAndUpdate('employee', { $inc: { seq: 1 } }, { new: true, upsert: true });
  this.code = `EMP-${String(c.seq).padStart(3, '0')}`;
  next();
});

module.exports = mongoose.model('Employee', employeeSchema);
