const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/eventController');

module.exports = buildRouter(crud);
