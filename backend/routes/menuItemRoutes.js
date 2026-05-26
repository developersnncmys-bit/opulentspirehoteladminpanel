const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/menuItemController');

module.exports = buildRouter(crud);
