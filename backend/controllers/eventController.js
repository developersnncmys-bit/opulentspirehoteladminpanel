const Event = require('../models/Event');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Event, {
  searchFields: ['name', 'venue', 'notes'],
  sort: 'date',
});
