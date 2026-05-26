const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/contractController');

module.exports = buildRouter(crud);
