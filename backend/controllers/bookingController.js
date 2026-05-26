const Booking = require('../models/Booking');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Booking, {
  searchFields: ['code', 'guest', 'room', 'source'],
  sort: '-createdAt',
});
