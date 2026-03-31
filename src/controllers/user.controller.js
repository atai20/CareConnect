const UserModel = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { buildPaginationResponse } = require('../utils/pagination');

const list = catchAsync(async (req, res) => {
  const { page, limit, role } = req.query;
  const { data, total } = await UserModel.list({ page, limit, role });
  res.json({ status: 200, ...buildPaginationResponse(data, total, page, limit) });
});

const getById = catchAsync(async (req, res) => {
  const user = await UserModel.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');

  const { password_hash, ...safeUser } = user;
  res.json({ status: 200, data: safeUser });
});

const update = catchAsync(async (req, res) => {
  // Users can only update their own profile (unless admin)
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id, 10)) {
    throw ApiError.forbidden();
  }

  const user = await UserModel.update(req.params.id, req.body);
  const { password_hash, ...safeUser } = user;
  res.json({ status: 200, data: safeUser });
});

const deactivate = catchAsync(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id, 10)) {
    throw ApiError.forbidden();
  }

  await UserModel.deactivate(req.params.id);
  res.status(204).send();
});

module.exports = { list, getById, update, deactivate };
