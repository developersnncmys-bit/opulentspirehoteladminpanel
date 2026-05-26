const mongoose = require('mongoose');

const spaBookingSchema = new mongoose.Schema(
  {
    guest:      { type: String, required: true, trim: true },
    package:    {
      type: String,
      enum: ['Aromatherapy Bliss', 'Couple Massage', 'Hot Stone Therapy', 'Gym Personal Training'],
      default: 'Aromatherapy Bliss',
    },
    therapist:  { type: String, enum: ['Anjali', 'Reema', 'Kavya', 'Priyanka'], default: 'Anjali' },
    time:       { type: String, trim: true, default: '14:00' },
    date:       { type: Date, default: Date.now },
    status:     { type: String, enum: ['Booked', 'In Progress', 'Done', 'Cancelled'], default: 'Booked' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SpaBooking', spaBookingSchema);
