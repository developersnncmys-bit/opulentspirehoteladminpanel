const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/ticketController');

module.exports = buildRouter(crud);
