const Guest = require('../models/Guest');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Guest, {
  searchFields: ['name', 'email', 'phone', 'city'],
  sort: '-createdAt',
});
