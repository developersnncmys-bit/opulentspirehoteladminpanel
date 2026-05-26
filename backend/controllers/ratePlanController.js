const RatePlan = require('../models/RatePlan');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(RatePlan, {
  searchFields: ['name', 'rooms', 'restrictions'],
  sort: '-createdAt',
});
