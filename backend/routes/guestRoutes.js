const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/guestController');

module.exports = buildRouter(crud);
