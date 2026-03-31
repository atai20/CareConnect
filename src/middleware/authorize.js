const ApiError = require('../utils/ApiError');

/**
 * Role-based authorization middleware.
 * Must be used AFTER authenticate middleware.
 *
 * Usage:
 *   router.get('/admin', authenticate, authorize('admin'), controller.adminOnly);
 *   router.get('/staff', authenticate, authorize('admin', 'caregiver'), controller.staffOnly);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' does not have access to this resource`
      );
    }

    next();
  };
};

module.exports = authorize;
