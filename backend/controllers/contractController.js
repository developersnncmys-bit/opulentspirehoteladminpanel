const Contract = require('../models/Contract');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Contract, {
  searchFields: ['name', 'gst', 'contact'],
  sort: '-createdAt',
});
