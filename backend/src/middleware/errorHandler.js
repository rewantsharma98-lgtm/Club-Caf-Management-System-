const errorHandler = (err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
    errors: err.errors || undefined,
  });
};

module.exports = errorHandler;
