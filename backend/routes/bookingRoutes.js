const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/bookingController');

module.exports = buildRouter(crud);
