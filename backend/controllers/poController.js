const PurchaseOrder = require('../models/PurchaseOrder');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(PurchaseOrder, {
  searchFields: ['code', 'vendor', 'notes'],
  sort: '-createdAt',
});
