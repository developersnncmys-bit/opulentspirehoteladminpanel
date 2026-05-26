const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/employeeController');

module.exports = buildRouter(crud);
