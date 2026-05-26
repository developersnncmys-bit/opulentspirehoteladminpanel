const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/spaBookingController');

module.exports = buildRouter(crud);
