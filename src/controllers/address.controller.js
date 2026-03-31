const AddressModel = require('../models/address.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const list = catchAsync(async (req, res) => {
  const addresses = await AddressModel.listForUser(req.user.id);
  res.json({ status: 200, data: addresses });
});

const create = catchAsync(async (req, res) => {
  const address = await AddressModel.create({ user_id: req.user.id, ...req.body });
  res.status(201).json({ status: 201, data: address });
});

const update = catchAsync(async (req, res) => {
  const address = await AddressModel.findById(req.params.id);
  if (!address) throw ApiError.notFound('Address not found');
  if (address.user_id !== req.user.id) throw ApiError.forbidden();

  const updated = await AddressModel.update(req.params.id, req.body);
  res.json({ status: 200, data: updated });
});

const remove = catchAsync(async (req, res) => {
  const address = await AddressModel.findById(req.params.id);
  if (!address) throw ApiError.notFound('Address not found');
  if (address.user_id !== req.user.id) throw ApiError.forbidden();

  await AddressModel.delete(req.params.id);
  res.status(204).send();
});

module.exports = { list, create, update, remove };
