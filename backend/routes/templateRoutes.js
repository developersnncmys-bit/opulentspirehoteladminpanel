const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/templateController');

module.exports = buildRouter(crud);
