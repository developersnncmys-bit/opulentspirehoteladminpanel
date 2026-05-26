const Invoice = require('../models/Invoice');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Invoice, {
  searchFields: ['code', 'guest', 'room'],
  sort: '-createdAt',
});
