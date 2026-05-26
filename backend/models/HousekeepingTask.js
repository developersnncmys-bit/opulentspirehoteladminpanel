const mongoose = require('mongoose');

const housekeepingTaskSchema = new mongoose.Schema(
  {
    room:     { type: String, required: true, trim: true },
    floor:    { type: Number, default: 1 },
    assigned: { type: String, trim: true },
    type:     { type: String, enum: ['Turnaround', 'Stay-over', 'Deep clean', 'VIP setup', 'Inspection'], default: 'Turnaround' },
    status:   { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Inspected'], default: 'Pending' },
    mins:     { type: Number, default: 0 },
    notes:    { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HousekeepingTask', housekeepingTaskSchema);
