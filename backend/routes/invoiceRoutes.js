const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/invoiceController');

module.exports = buildRouter(crud);
