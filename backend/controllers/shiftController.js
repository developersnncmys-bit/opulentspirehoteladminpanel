const Shift = require('../models/Shift');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Shift, {
  searchFields: ['staff', 'role'],
  sort: 'date',
});
