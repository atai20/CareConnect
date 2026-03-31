const ApiError = require('../utils/ApiError');

/**
 * Request validation middleware using Joi schemas.
 * Validates body, query, and params against provided schema.
 *
 * Usage:
 *   router.post('/users', validate(createUserSchema), controller.create);
 *
 * Where schema is:
 *   { body: Joi.object({...}), query: Joi.object({...}), params: Joi.object({...}) }
 */
const validate = (schema) => (req, res, next) => {
  const validProperties = ['body', 'query', 'params'];
  const errors = [];

  validProperties.forEach((property) => {
    if (schema[property]) {
      const { error, value } = schema[property].validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const messages = error.details.map((detail) => detail.message);
        errors.push(...messages);
      } else {
        req[property] = value; // Replace with validated + stripped values
      }
    }
  });

  if (errors.length > 0) {
    throw ApiError.badRequest('Validation failed', errors);
  }

  next();
};

module.exports = validate;
