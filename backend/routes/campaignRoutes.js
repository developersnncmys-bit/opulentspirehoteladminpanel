const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/campaignController');

module.exports = buildRouter(crud);
