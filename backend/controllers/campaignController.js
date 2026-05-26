const Campaign = require('../models/Campaign');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Campaign, {
  searchFields: ['name', 'audience'],
  sort: '-createdAt',
});
