const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/housekeepingTaskController');

module.exports = buildRouter(crud);
