const Kot = require('../models/Kot');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Kot, {
  searchFields: ['code', 'table'],
  sort: '-createdAt',
});
