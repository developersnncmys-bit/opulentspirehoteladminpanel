const PromoCode = require('../models/PromoCode');
const buildCrud = require('../utils/crudController');

module.exports = buildCrud(PromoCode, {
  searchFields: ['code'],
  sort: '-createdAt',
});
