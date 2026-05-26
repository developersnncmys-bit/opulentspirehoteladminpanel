const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/kotController');

module.exports = buildRouter(crud);
