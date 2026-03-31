const ReviewModel = require('../models/review.model');
const CaregiverModel = require('../models/caregiver.model');
const AppointmentModel = require('../models/appointment.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const create = catchAsync(async (req, res) => {
  const { appointmentId, overallRating, punctuality, professionalism, skillLevel, comment } = req.body;

  // Verify appointment is completed
  const appointment = await AppointmentModel.findById(appointmentId);
  if (!appointment) throw ApiError.notFound('Appointment not found');
  if (appointment.status !== 'completed') {
    throw ApiError.badRequest('Can only review completed appointments');
  }

  // Check for existing review
  const existing = await ReviewModel.findByAppointmentId(appointmentId);
  if (existing) throw ApiError.conflict('Review already exists for this appointment');

  const review = await ReviewModel.create({
    appointment_id: appointmentId,
    reviewer_id: req.user.id,
    reviewee_id: appointment.caregiver_id, // Review is for the caregiver
    overall_rating: overallRating,
    punctuality,
    professionalism,
    skill_level: skillLevel,
    comment,
  });

  // Update caregiver's average rating
  await CaregiverModel.updateRating(appointment.caregiver_id);

  res.status(201).json({ status: 201, data: review });
});

const getById = catchAsync(async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');
  res.json({ status: 200, data: review });
});

const update = catchAsync(async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');
  if (review.reviewer_id !== req.user.id) throw ApiError.forbidden();

  // Check 48-hour edit window
  const hoursSinceCreation = (Date.now() - new Date(review.created_at).getTime()) / (1000 * 60 * 60);
  if (hoursSinceCreation > 48) {
    throw ApiError.badRequest('Reviews can only be edited within 48 hours');
  }

  const updated = await ReviewModel.update(req.params.id, req.body);
  res.json({ status: 200, data: updated });
});

const remove = catchAsync(async (req, res) => {
  const review = await ReviewModel.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');
  if (review.reviewer_id !== req.user.id && req.user.role !== 'admin') {
    throw ApiError.forbidden();
  }

  await ReviewModel.delete(req.params.id);
  res.status(204).send();
});

module.exports = { create, getById, update, remove };
