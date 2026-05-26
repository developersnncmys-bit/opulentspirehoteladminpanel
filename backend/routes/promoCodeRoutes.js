const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/promoCodeController');

module.exports = buildRouter(crud);
