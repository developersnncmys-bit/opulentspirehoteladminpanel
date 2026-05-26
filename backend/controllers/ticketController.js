const Ticket = require('../models/Ticket');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Ticket, {
  searchFields: ['code', 'location', 'issue', 'assigned'],
  sort: '-createdAt',
});
