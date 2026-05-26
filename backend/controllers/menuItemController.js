const MenuItem = require('../models/MenuItem');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(MenuItem, {
  searchFields: ['name', 'category'],
  sort: 'category name',
});
