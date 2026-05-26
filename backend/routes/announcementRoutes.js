const buildRouter = require('../utils/crudRouter');
const crud = require('../controllers/announcementController');

module.exports = buildRouter(crud);
