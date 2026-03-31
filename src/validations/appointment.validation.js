const Joi = require('joi');

const createAppointment = {
  body: Joi.object({
    serviceTypeId: Joi.number().integer().required(),
    addressId: Joi.number().integer().required(),
    scheduledStart: Joi.date().iso().greater('now').required(),
    scheduledEnd: Joi.date().iso().greater(Joi.ref('scheduledStart')).required(),
    notes: Joi.string().max(2000).allow('', null),
    tasks: Joi.array().items(
      Joi.object({
        description: Joi.string().max(500).required(),
        sortOrder: Joi.number().integer().default(0),
      })
    ),
  }),
};

const updateAppointment = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object({
    scheduledStart: Joi.date().iso(),
    scheduledEnd: Joi.date().iso(),
    notes: Joi.string().max(2000).allow('', null),
    cancellationReason: Joi.string().max(500),
  }).min(1),
};

const listAppointments = {
  query: Joi.object({
    status: Joi.string().valid('pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'no_show'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sortBy: Joi.string().valid('scheduled_start', 'created_at').default('scheduled_start'),
    order: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

module.exports = { createAppointment, updateAppointment, listAppointments };
