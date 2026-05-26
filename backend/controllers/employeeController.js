const Employee = require('../models/Employee');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(Employee, {
  searchFields: ['code', 'name', 'role', 'email', 'phone'],
  sort: '-createdAt',
});
