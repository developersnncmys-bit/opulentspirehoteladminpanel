const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    who:    { type: String, required: true, trim: true },
    role:   { type: String, trim: true, default: 'Staff' },
    text:   { type: String, required: true, trim: true },
    pinned: { type: Boolean, default: false },
    channel:{ type: String, default: '# announcements' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
