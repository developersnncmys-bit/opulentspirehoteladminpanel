const express = require('express');
const buildRouter = require('../utils/crudRouter');
const ctrl = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Token can come via header (api client) or ?token=... query (browser <a> link).
function tokenFromQuery(req, _res, next) {
  if (!req.headers.authorization && req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }
  next();
}

router.get('/:id/pdf', tokenFromQuery, protect, ctrl.downloadPdf);
router.use(buildRouter(ctrl));

module.exports = router;
