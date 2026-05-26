const Announcement = require('../models/Announcement');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Announcement, {
  searchFields: ['who', 'role', 'text', 'channel'],
  sort: '-createdAt',
});
