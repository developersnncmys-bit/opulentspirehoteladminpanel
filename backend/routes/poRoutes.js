const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/poController');

module.exports = buildRouter(crud);
