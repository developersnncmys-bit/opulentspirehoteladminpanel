const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema(
  {
    date:  { type: Date, required: true },
    role:  {
      type: String,
      enum: ['Management', 'Front Desk', 'Housekeeping', 'Maintenance', 'F&B', 'Spa', 'Admin'],
      default: 'Front Desk',
    },
    staff: { type: String, required: true, trim: true },
    shift: { type: String, enum: ['Morning', 'General', 'Night', 'Off'], default: 'Morning' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shift', shiftSchema);
