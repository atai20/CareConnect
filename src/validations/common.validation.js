const Joi = require('joi');

const idParam = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
};

const paginationQuery = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  }),
};

const createAddress = {
  body: Joi.object({
    label: Joi.string().max(50).default('home'),
    streetAddress: Joi.string().max(255).required(),
    aptUnit: Joi.string().max(50).allow('', null),
    city: Joi.string().max(100).required(),
    state: Joi.string().max(50).required(),
    zipCode: Joi.string().max(20).required(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    isDefault: Joi.boolean().default(false),
  }),
};

module.exports = { idParam, paginationQuery, createAddress };
