const Template = require('../models/Template');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Template, {
  searchFields: ['name', 'trigger', 'body'],
  sort: '-createdAt',
});
