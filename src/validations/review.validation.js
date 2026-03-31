const Joi = require('joi');

const createReview = {
  body: Joi.object({
    appointmentId: Joi.number().integer().required(),
    overallRating: Joi.number().integer().min(1).max(5).required(),
    punctuality: Joi.number().integer().min(1).max(5),
    professionalism: Joi.number().integer().min(1).max(5),
    skillLevel: Joi.number().integer().min(1).max(5),
    comment: Joi.string().max(2000).allow('', null),
  }),
};

const updateReview = {
  params: Joi.object({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object({
    overallRating: Joi.number().integer().min(1).max(5),
    punctuality: Joi.number().integer().min(1).max(5),
    professionalism: Joi.number().integer().min(1).max(5),
    skillLevel: Joi.number().integer().min(1).max(5),
    comment: Joi.string().max(2000).allow('', null),
  }).min(1),
};

module.exports = { createReview, updateReview };
