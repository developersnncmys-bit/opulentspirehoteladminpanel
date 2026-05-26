const express = require('express');
const { protect } = require('../middleware/auth');

function buildRouter(crud, { auth = true } = {}) {
  const router = express.Router();
  if (auth) router.use(protect);

  router.route('/').get(crud.list).post(crud.create);
  router.route('/:id').get(crud.getOne).put(crud.update).delete(crud.remove);

  return router;
}

module.exports = buildRouter;
