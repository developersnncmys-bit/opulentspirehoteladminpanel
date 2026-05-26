function notFound(req, res, next) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

function errorHandler(err, req, res, _next) {
  const status = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message])),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: 'Duplicate key',
      keyValue: err.keyValue,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  res.status(status).json({
    message: err.message || 'Server error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
