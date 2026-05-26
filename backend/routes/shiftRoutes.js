const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/shiftController');

module.exports = buildRouter(crud);
