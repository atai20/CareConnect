const CaregiverModel = require('../models/caregiver.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const search = catchAsync(async (req, res) => {
  const { lat, lon, serviceLevel, dayOfWeek, page, limit } = req.query;

  // Only parse numeric params if they were actually provided.
  // parseFloat(undefined) = NaN, which would poison our SQL queries.
  const parsedLat = lat !== undefined ? parseFloat(lat) : undefined;
  const parsedLon = lon !== undefined ? parseFloat(lon) : undefined;
  const parsedDay = dayOfWeek !== undefined ? parseInt(dayOfWeek, 10) : undefined;

  // Validate that parsed numbers are actually numbers
  if (parsedLat !== undefined && isNaN(parsedLat)) throw ApiError.badRequest('Invalid latitude');
  if (parsedLon !== undefined && isNaN(parsedLon)) throw ApiError.badRequest('Invalid longitude');
  if (parsedDay !== undefined && (isNaN(parsedDay) || parsedDay < 0 || parsedDay > 6)) {
    throw ApiError.badRequest('dayOfWeek must be 0-6 (Sunday=0, Saturday=6)');
  }

  const results = await CaregiverModel.search({
    lat: parsedLat, lon: parsedLon,
    serviceLevel, dayOfWeek: parsedDay,
    page: parseInt(page, 10) || 1, limit: parseInt(limit, 10) || 20,
  });
  res.json({ status: 200, data: results });
});

const getById = catchAsync(async (req, res) => {
  const caregiver = await CaregiverModel.findById(req.params.id);
  if (!caregiver) throw ApiError.notFound('Caregiver not found');

  const certifications = await CaregiverModel.getCertifications(caregiver.id);
  res.json({ status: 200, data: { ...caregiver, certifications } });
});

const addCertification = catchAsync(async (req, res) => {
  const cert = await CaregiverModel.addCertification({
    caregiver_id: req.params.id,
    ...req.body,
  });
  res.status(201).json({ status: 201, data: cert });
});

const removeCertification = catchAsync(async (req, res) => {
  await CaregiverModel.removeCertification(req.params.id, req.params.certId);
  res.status(204).send();
});

const getAvailability = catchAsync(async (req, res) => {
  const availability = await CaregiverModel.getAvailability(req.params.id);
  res.json({ status: 200, data: availability });
});

const setAvailability = catchAsync(async (req, res) => {
  const availability = await CaregiverModel.setAvailability(req.params.id, req.body.slots);
  res.json({ status: 200, data: availability });
});

module.exports = { search, getById, addCertification, removeCertification, getAvailability, setAvailability };
