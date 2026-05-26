const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/ratePlanController');

module.exports = buildRouter(crud);
