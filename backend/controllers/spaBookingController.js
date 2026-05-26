const SpaBooking = require('../models/SpaBooking');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(SpaBooking, {
  searchFields: ['guest', 'therapist', 'package'],
  sort: '-createdAt',
});
