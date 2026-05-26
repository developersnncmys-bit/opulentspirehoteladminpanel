const HousekeepingTask = require('../models/HousekeepingTask');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(HousekeepingTask, {
  searchFields: ['room', 'assigned', 'type'],
  sort: '-createdAt',
});
