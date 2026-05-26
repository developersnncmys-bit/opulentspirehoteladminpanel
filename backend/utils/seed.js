require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Booking = require('../models/Booking');
const Guest = require('../models/Guest');
const Invoice = require('../models/Invoice');
const Employee = require('../models/Employee');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const PurchaseOrder = require('../models/PurchaseOrder');
const Campaign = require('../models/Campaign');
const Contract = require('../models/Contract');
const RatePlan = require('../models/RatePlan');
const Kot = require('../models/Kot');
const Announcement = require('../models/Announcement');
const Shift = require('../models/Shift');
const Template = require('../models/Template');
const SpaBooking = require('../models/SpaBooking');

async function seed() {
  await connectDB();

  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany(),
    Booking.deleteMany(),
    Guest.deleteMany(),
    Invoice.deleteMany(),
    Employee.deleteMany(),
    Ticket.deleteMany(),
    Event.deleteMany(),
    PurchaseOrder.deleteMany(),
    Campaign.deleteMany(),
    Contract.deleteMany(),
    RatePlan.deleteMany(),
    Kot.deleteMany(),
    Announcement.deleteMany(),
    Shift.deleteMany(),
    Template.deleteMany(),
    SpaBooking.deleteMany(),
    mongoose.connection.collection('counters').deleteMany({}),
  ]);

  console.log('Seeding admin user...');
  await User.create({
    name: 'Aarav Mehta',
    email: 'aarav@grandpalace.in',
    password: 'demo-password',
    role: 'Hotel Manager',
  });

  console.log('Seeding bookings...');
  await Booking.create([
    { guest: 'Priya Sharma',  room: '402 · Suite',    checkIn: '2026-05-25', checkOut: '2026-05-28', source: 'Direct',     amount: 42800, status: 'Confirmed' },
    { guest: 'Rohan Iyer',    room: '218 · Deluxe',   checkIn: '2026-05-25', checkOut: '2026-05-26', source: 'MakeMyTrip', amount: 8600,  status: 'Confirmed' },
    { guest: 'Anika Kapoor',  room: '511 · Premium',  checkIn: '2026-05-25', checkOut: '2026-05-27', source: 'Booking',    amount: 19400, status: 'Hold' },
  ]);

  console.log('Seeding guests...');
  await Guest.create([
    { name: 'Priya Sharma', loyalty: 'Platinum', stays: 12, last: '2026-05-12', city: 'Mumbai',    prefs: 'Sea view, Vegan' },
    { name: 'Rohan Iyer',   loyalty: 'Gold',     stays: 6,  last: '2026-04-02', city: 'Bengaluru', prefs: 'High floor' },
    { name: 'Anika Kapoor', loyalty: 'Platinum', stays: 18, last: '2026-05-20', city: 'Delhi',     prefs: 'Spa add-on' },
  ]);

  console.log('Seeding employees...');
  await Employee.create([
    { name: 'Aarav Mehta',  role: 'Hotel Manager',   dept: 'Management',  joined: '2022-04-01', salary: 120000 },
    { name: 'Sneha Patil',  role: 'Front Desk Lead', dept: 'Front Desk',  joined: '2023-01-15', salary: 52000 },
    { name: 'Ravi Kumar',   role: 'Maint. Engineer', dept: 'Maintenance', joined: '2021-11-08', salary: 38000 },
  ]);

  console.log('Seeding tickets...');
  await Ticket.create([
    { location: 'Room 218',   issue: 'AC not cooling',    assigned: 'Ravi',   priority: 'High',     sla: '2h',  status: 'In Progress' },
    { location: 'Lobby',      issue: 'Lighting flicker',  assigned: 'Suresh', priority: 'Medium',   sla: '6h',  status: 'Open' },
  ]);

  console.log('Seeding events...');
  await Event.create([
    { name: 'Sharma Wedding', venue: 'Grand Hall',  pax: 320, date: '2026-06-10', value: 1480000, status: 'Confirmed' },
    { name: 'Adobe Offsite',  venue: 'Conf Room A', pax: 48,  date: '2026-07-12', value: 680000,  status: 'Quoted' },
  ]);

  console.log('Seeding purchase orders...');
  await PurchaseOrder.create([
    { vendor: 'Welspun',  items: 4, value: 48200, eta: '2026-05-28', status: 'In Transit' },
    { vendor: 'Tata Tea', items: 2, value: 6400,  eta: '2026-05-26', status: 'Confirmed' },
  ]);

  console.log('Seeding campaigns...');
  await Campaign.create([
    { name: 'Monsoon Getaway',   channel: 'Email',    audience: 'Repeat 5+ stays', sent: 4820, opens: 1832, clicks: 578, status: 'Live' },
    { name: 'Anniversary Promo', channel: 'WhatsApp', audience: 'VIP / Platinum',  sent: 284,  opens: 267,  clicks: 119, status: 'Live' },
  ]);

  console.log('Seeding contracts...');
  await Contract.create([
    { name: 'Infosys Ltd.',     gst: '29AAACI4741', rate: 3900, credit: 420000, billing: 'Monthly' },
    { name: 'TCS Travel Desk',  gst: '27AAACT8261', rate: 4200, credit: 880000, billing: 'Fortnightly' },
  ]);

  console.log('Seeding rate plans...');
  await RatePlan.create([
    { name: 'Best Available',   rooms: 'All',    base: 4800,  restrictions: '—',         active: true },
    { name: 'Weekend Premium',  rooms: 'Suite',  base: 12500, restrictions: 'Fri–Sun',   active: true },
  ]);

  console.log('Seeding KOTs...');
  await Kot.create([
    { table: 'T-12',   items: 4, total: 1860, status: 'Cooking' },
    { table: 'Rm-402', items: 3, total: 2140, status: 'Ready' },
  ]);

  console.log('Seeding announcements...');
  await Announcement.create([
    { who: 'Aarav Mehta', role: 'GM', text: 'VIP arrival at 18:30 today. Prep welcome amenity.', pinned: true },
    { who: 'Sneha Patil', role: 'Front Desk', text: 'Two early check-ins approved for Room 305 and 402.' },
  ]);

  console.log('Seeding shifts...');
  await Shift.create([
    { date: '2026-05-25', role: 'Front Desk', staff: 'Sneha Patil',  shift: 'Morning' },
    { date: '2026-05-25', role: 'F&B',        staff: 'Mahesh Singh', shift: 'General' },
  ]);

  console.log('Seeding templates...');
  await Template.create([
    { name: 'Booking Confirmation', channels: ['Email', 'WhatsApp'], trigger: 'On booking creation',   active: true },
    { name: 'Check-in Reminder',    channels: ['SMS', 'WhatsApp'],   trigger: 'Day before arrival',    active: true },
  ]);

  console.log('Seeding spa bookings...');
  await SpaBooking.create([
    { guest: 'Priya Sharma', package: 'Aromatherapy Bliss', therapist: 'Anjali', time: '14:00', status: 'Booked' },
  ]);

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
