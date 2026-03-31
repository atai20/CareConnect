/**
 * Wraps an async route handler so thrown errors are passed to next().
 * Without this, every controller needs its own try/catch.
 *
 * Usage:
 *   router.get('/users', catchAsync(async (req, res) => { ... }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
